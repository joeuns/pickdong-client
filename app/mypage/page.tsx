"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { MapPin, Settings, Trash2, LogOut, Calendar } from "lucide-react";
import { SubscriptionModal } from "@/components/subscription-modal";
import { useAuth } from "@/components/auth-provider";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { useEmailSubscribe } from "@/hooks/use-member";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteMember } from "@/lib/services/member";
import {
  getSubscriptions,
  updateSubscription,
} from "@/lib/services/subscription";
import { getEventsBySubscribedAreas, type Tour } from "@/lib/services/events";
import { Footer } from "@/components/footer";

const PAGE_SIZE = 10; // keep in sync with backend if possible

export default function MyPage() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const {
    emailSubscribe: emailNotifications,
    setEmailSubscribe: setEmailNotifications,
  } = useEmailSubscribe(true);

  const [tours, setTours] = useState<Tour[]>([]);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [subscribedRegions, setSubscribedRegions] = useState<
    Record<string, string[]>
  >({});
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [hasNext, setHasNext] = useState(false);
  const [page, setPage] = useState(0); // current loaded page index
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // sentinel for IntersectionObserver
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Redirect if not logged in (wait for auth init)
  useEffect(() => {
    if (isLoading) return;
    if (!user && !isLoggingOut) {
      router.replace("/login");
    }
  }, [user, isLoading, isLoggingOut, router]);

  // Load subscriptions & first page
  useEffect(() => {
    const loadInitial = async () => {
      if (!user) return;
      try {
        setIsLoadingEvents(true);

        // Load subscriptions -> subscribedRegions map
        const subscriptions = await getSubscriptions();
        const regionsMap: Record<string, string[]> = {};
        subscriptions.areas.forEach((area: any) => {
          const subscribedSubAreas = area.subAreas
            .filter((subArea: any) => subArea.subscribe)
            .map((subArea: any) => subArea.name);
          if (subscribedSubAreas.length > 0) {
            regionsMap[area.name] = subscribedSubAreas;
          }
        });
        setSubscribedRegions(regionsMap);

        // First page load
        const firstPage = 0;
        const toursData = await getEventsBySubscribedAreas(firstPage);
        setTours(toursData.tours);
        setHasNext(toursData.metaData.hasNext);
        setPage(firstPage);
      } catch (error) {
        console.error("데이터 로딩 실패:", error);
      } finally {
        setIsLoadingEvents(false);
      }
    };

    loadInitial();
  }, [user]);

  const appendTours = useCallback((incoming: Tour[]) => {
    // Deduplicate by tourId when appending pages
    setTours((prev) => {
      const seen = new Set(prev.map((t) => t.tourId));
      const merged = [...prev];
      for (const t of incoming) {
        if (!seen.has(t.tourId)) {
          merged.push(t);
          seen.add(t.tourId);
        }
      }
      return merged;
    });
  }, []);

  const loadMore = useCallback(async () => {
    if (isLoadingEvents || !hasNext) return;
    try {
      setIsLoadingEvents(true);
      const nextPage = page + 1;
      const toursData = await getEventsBySubscribedAreas(nextPage);
      appendTours(toursData.tours);
      setHasNext(toursData.metaData.hasNext);
      setPage(nextPage);
    } catch (e) {
      console.error("추가 투어 로딩 실패:", e);
    } finally {
      setIsLoadingEvents(false);
    }
  }, [appendTours, hasNext, isLoadingEvents, page]);

  // IntersectionObserver setup
  useEffect(() => {
    if (!sentinelRef.current) return;

    // cleanup existing observer before creating a new one
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          // request next page
          // guard by flags to avoid bursts
          if (!isLoadingEvents && hasNext) {
            void loadMore();
          }
        }
      },
      {
        root: null,
        rootMargin: "200px", // prefetch a bit before hitting the bottom
        threshold: 0,
      }
    );

    observerRef.current.observe(sentinelRef.current);

    return () => {
      observerRef.current?.disconnect();
      observerRef.current = null;
    };
  }, [loadMore, hasNext, isLoadingEvents]);

  // Unsubscribe / Subscribe handlers keep same behavior but reset list to page 0 after mutation
  const reloadFirstPage = useCallback(async () => {
    try {
      setIsLoadingEvents(true);
      const toursData = await getEventsBySubscribedAreas(0);
      setTours(toursData.tours);
      setHasNext(toursData.metaData.hasNext);
      setPage(0);
    } catch (e) {
      console.error("리로드 실패", e);
    } finally {
      setIsLoadingEvents(false);
    }
  }, []);

  const handleUnsubscribe = async (city: string, district: string) => {
    try {
      const subscriptions = await getSubscriptions();
      const area = subscriptions.areas.find((a: any) => a.name === city);
      const subArea = area?.subAreas.find((sa: any) => sa.name === district);

      if (area && subArea) {
        await updateSubscription(area.areaCode, subArea.sigunGuCode, false);

        setSubscribedRegions((prev) => {
          const next = { ...prev } as Record<string, string[]>;
          if (next[city]) {
            next[city] = next[city].filter((d) => d !== district);
            if (next[city].length === 0) delete next[city];
          }
          return next;
        });

        await reloadFirstPage();
      }
    } catch (error) {
      console.error("구독 해제 실패:", error);
    }
  };

  const handleSubscribe = async (city: string, district: string) => {
    try {
      const subscriptions = await getSubscriptions();
      const area = subscriptions.areas.find((a: any) => a.name === city);
      const subArea = area?.subAreas.find((sa: any) => sa.name === district);

      if (area && subArea) {
        await updateSubscription(area.areaCode, subArea.sigunGuCode, true);

        setSubscribedRegions((prev) => {
          const next = { ...prev } as Record<string, string[]>;
          if (!next[city]) next[city] = [];
          if (!next[city].includes(district))
            next[city] = [...next[city], district];
          return next;
        });

        await reloadFirstPage();
      }
    } catch (error) {
      console.error("구독 실패:", error);
    }
  };

  const handleLogout = () => {
    setIsLoggingOut(true);
    logout();
    router.push("/");
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteMember();
      logout();
      window.location.replace("/");
    } catch (e) {
      console.error("회원 탈퇴 실패", e);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header showMyPageButton={true} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <div className="mb-6">
                  <div className="text-center mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      메일 알림 설정
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      구독한 지역의 축제 정보를 이메일로 받아보세요
                    </p>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-3 mb-4">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-1">
                        알림 받을 이메일
                      </p>
                      <p className="text-sm font-medium text-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div>
                      <span className="text-sm font-medium">
                        이메일로 알림받기
                      </span>
                      <p className="text-xs text-muted-foreground">
                        새로운 축제 정보를 메일로 받기
                      </p>
                    </div>
                    <Switch
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                    />
                  </div>

                  <Button
                    variant="outline"
                    className="w-full justify-start bg-transparent"
                    onClick={() => setIsSubscriptionModalOpen(true)}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    구독 지역 관리하기
                  </Button>

                  <div className="pt-4 border-t space-y-2">
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={handleLogout}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      로그아웃
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          회원탈퇴
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            정말로 탈퇴하시겠습니까?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            탈퇴 시 모든 구독 및 계정 정보가 삭제됩니다. 이
                            작업은 되돌릴 수 없습니다.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>취소</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDeleteAccount}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            탈퇴하기
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardContent className="p-6">
                <div className="mb-6">
                  <h1 className="text-3xl font-bold text-foreground mb-2">
                    구독 지역의 축제
                  </h1>
                  <p className="text-muted-foreground">
                    구독하신 지역에서 현재 진행되는 다양한 행사들을 확인해보세요
                  </p>
                </div>

                {/* Events Grid */}
                {isLoadingEvents && tours.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="inline-flex items-center space-x-2 text-muted-foreground">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-primary rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-primary rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <span className="ml-2 text-sm">
                        축제 정보를 불러오는 중...
                      </span>
                    </div>
                  </div>
                ) : tours.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      구독한 지역의 축제가 없습니다.
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      구독 지역을 추가해보세요!
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {tours.map((tour) => (
                        <Card
                          key={tour.tourId}
                          className="overflow-hidden hover:shadow-lg transition-shadow group"
                        >
                          {/* 이미지 영역 */}
                          <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                            <img
                              src={tour.mainImageUrl || "/placeholder.svg"}
                              alt={tour.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>

                          {/* 콘텐츠 영역 */}
                          <div className="p-0 px-4 space-y-2">
                            <h3 className="text-lg font-semibold text-foreground line-clamp-1 -mt-1">
                              {tour.title}
                            </h3>

                            <div className="flex items-center text-sm text-muted-foreground">
                              <Calendar className="w-4 h-4 mr-2" />
                              <span>
                                {tour.startDate === tour.endDate
                                  ? tour.startDate
                                  : `${tour.startDate} - ${tour.endDate}`}
                              </span>
                            </div>

                            <div className="flex items-center text-sm text-muted-foreground">
                              <MapPin className="w-4 h-4 mr-2" />
                              <span>
                                {tour.area} {tour.sigunGu}
                              </span>
                            </div>

                            <div className="flex flex-wrap gap-1 pt-1">
                              {tour.keywords
                                .slice(0, 3)
                                .map((keyword, index) => (
                                  <Badge
                                    key={index}
                                    variant="secondary"
                                    className="text-xs bg-primary/10 text-primary hover:bg-primary/20"
                                  >
                                    {keyword}
                                  </Badge>
                                ))}
                            </div>

                            <div className="pt-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full h-12 bg-transparent"
                                onClick={() =>
                                  router.push(`/event/${tour.tourId}`)
                                }
                              >
                                자세히 보기
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>

                    {/* Sentinel for infinite scroll */}
                    <div ref={sentinelRef} className="h-10" />

                    {/* Loading / Status Indicators */}
                    {isLoadingEvents && tours.length > 0 && (
                      <div className="text-center py-6">
                        <div className="inline-flex items-center space-x-2 text-muted-foreground">
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-primary rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-primary rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                          <span className="ml-2 text-sm">
                            더 많은 행사를 불러오는 중...
                          </span>
                        </div>
                      </div>
                    )}

                    {!isLoadingEvents && !hasNext && tours.length > 0 && (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">
                          모든 행사를 확인했습니다
                        </p>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <SubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
        subscribedRegions={subscribedRegions}
        onUnsubscribe={handleUnsubscribe}
        onSubscribe={handleSubscribe}
      />

      <Footer />
    </div>
  );
}
