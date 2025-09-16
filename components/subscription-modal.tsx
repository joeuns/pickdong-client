"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X, MapPin, Plus } from "lucide-react";
import {
  getSubscriptions,
  updateSubscription,
} from "@/lib/services/subscription";
import { Area } from "@/lib/types";

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscribedRegions: { [key: string]: string[] };
  onUnsubscribe: (city: string, district: string) => void;
  onSubscribe?: (city: string, district: string) => void;
}

export function SubscriptionModal({
  isOpen,
  onClose,
  subscribedRegions,
  onUnsubscribe,
  onSubscribe,
}: SubscriptionModalProps) {
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState<string | null>(null); // 업데이트 중인 지역 코드

  // 실제 API 호출
  useEffect(() => {
    if (isOpen) {
      setLoading(true);

      const fetchSubscriptions = async () => {
        try {
          const response = await getSubscriptions();

          // API 응답을 기반으로 구독 상태 업데이트
          const updatedAreas = response.areas.map((area) => ({
            ...area,
            subAreas: area.subAreas.map((subArea) => ({
              ...subArea,
              subscribe:
                subscribedRegions[area.name]?.includes(subArea.name) ||
                subArea.subscribe,
            })),
          }));

          setAreas(updatedAreas);
        } catch (error) {
          console.error("구독 정보를 불러오는데 실패했습니다:", error);
          // 에러 발생 시 빈 배열로 설정
          setAreas([]);
        } finally {
          setLoading(false);
        }
      };

      fetchSubscriptions();
    }
  }, [isOpen]);

  const getTotalSubscriptions = () => {
    return areas.reduce(
      (total, area) =>
        total + area.subAreas.filter((subArea) => subArea.subscribe).length,
      0
    );
  };

  const handleRegionClick = async (
    areaCode: string,
    areaName: string,
    sigunGuCode: string,
    subAreaName: string,
    isSubscribed: boolean
  ) => {
    const updateKey = `${areaCode}-${sigunGuCode}`;

    try {
      setUpdating(updateKey);

      // API 호출로 구독 상태 변경
      await updateSubscription(areaCode, sigunGuCode, !isSubscribed);

      // 로컬 상태 업데이트
      setAreas((prevAreas) =>
        prevAreas.map((area) =>
          area.areaCode === areaCode
            ? {
                ...area,
                subAreas: area.subAreas.map((subArea) =>
                  subArea.sigunGuCode === sigunGuCode
                    ? { ...subArea, subscribe: !isSubscribed }
                    : subArea
                ),
              }
            : area
        )
      );

      // 부모 컴포넌트 상태도 업데이트
      if (isSubscribed) {
        onUnsubscribe(areaName, subAreaName);
      } else if (onSubscribe) {
        onSubscribe(areaName, subAreaName);
      }
    } catch (error) {
      console.error("구독 상태 변경 실패:", error);
      // 에러 발생 시 사용자에게 알림 (토스트 등)
      alert("구독 상태 변경에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setUpdating(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-yellow-300 scrollbar-track-gray-100 hover:scrollbar-thumb-yellow-400">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-primary" />
            지역 구독 관리
          </DialogTitle>
          <DialogDescription>
            전체 지역을 확인하고 구독할 수 있습니다. 구독한 지역은 노란색으로
            표시됩니다.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">지역 정보를 불러오는 중...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {areas.map((area) => {
              const subscribedCount = area.subAreas.filter(
                (subArea) => subArea.subscribe
              ).length;
              return (
                <div key={area.areaCode} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-lg text-foreground">
                      {area.name}
                    </h4>
                    {/* <Badge variant="secondary" className="text-xs">
                      {subscribedCount}/{area.subAreas.length}개 구독
                    </Badge> */}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {area.subAreas.map((subArea) => {
                      const updateKey = `${area.areaCode}-${subArea.sigunGuCode}`;
                      const isUpdating = updating === updateKey;

                      return (
                        <Button
                          key={subArea.sigunGuCode}
                          variant="outline"
                          size="sm"
                          disabled={isUpdating}
                          onClick={() =>
                            handleRegionClick(
                              area.areaCode,
                              area.name,
                              subArea.sigunGuCode,
                              subArea.name,
                              subArea.subscribe
                            )
                          }
                          className={`h-10 justify-between transition-colors ${
                            subArea.subscribe
                              ? "bg-yellow-500/20 text-yellow-800 hover:bg-yellow-500/30 border-yellow-500/30"
                              : "bg-muted/30 text-muted-foreground hover:bg-muted/50 border-muted"
                          } ${
                            isUpdating ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        >
                          <span className="text-sm">{subArea.name}</span>
                          {isUpdating ? (
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          ) : subArea.subscribe ? (
                            <X className="w-4 h-4" />
                          ) : (
                            <Plus className="w-4 h-4" />
                          )}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="pt-4 border-t">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>총 구독 지역</span>
            <span className="font-semibold text-primary">
              {getTotalSubscriptions()}개
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
