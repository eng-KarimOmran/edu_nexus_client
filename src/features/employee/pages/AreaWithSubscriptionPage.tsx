import type { DataTableProps } from "@/components/Table/TableUi";
import { useAreaWithSubscription } from "../api/employee.query";
import type { SubscriptionWithClient } from "@/features/subscription/subscription.type";
import type { Header } from "@/components/Table/HeaderTable";
import type { PageHeaderProps } from "@/components/PageHeader/PageHeader";
import PageHeader from "@/components/PageHeader/PageHeader";
import TableUi from "@/components/Table/TableUi";
import { useSearchParams } from "react-router-dom";
import { useAreas } from "@/features/area/api/area.query";

import { contactLink } from "@/lib/phoneLinks";
import { Button } from "@/components/ui/button";
import CopyBtn from "@/components/CopyBtn/CopyBtn";
import { enumTranslations } from "@/lib/enumTranslations";
import { BadgeDemo } from "@/components/CustomBadge/CustomBadge";
import { formatDate } from "@/lib/formatDate";
import SubscriptionActions from "@/features/subscription/config/subscription.actions";
import { useEffect } from "react";
import { RiMapPinLine } from "@remixicon/react";

export default function AreaWithSubscriptionPage() {
  const [searchParams] = useSearchParams();

  const page = Math.max(1, Number(searchParams.get("page") ?? 1));

  const limit = Math.max(10, Number(searchParams.get("limit") ?? 10));

  const { data: areas, isLoading: isLoadingAreas } = useAreas({
    page: 1,
    limit: 100,
    isActive: true,
  });

  const areaId =
    searchParams.get("areaId") ?? localStorage.getItem("areaId") ?? "";

  useEffect(() => {
    localStorage.setItem("areaId", areaId);
  }, [areaId]);

  const { data, isLoading } = useAreaWithSubscription({
    areaId,
    page,
    limit,
  });

  const headers: Header<SubscriptionWithClient>[] = [
    {
      key: "client",
      header: "اسم العميل",
      display(item) {
        return item.client.name;
      },
    },
    {
      key: "client",
      header: "رقم العميل",
      display(item) {
        return (
          <div className="flex items-center gap-0.5">
            <Button
              variant={"link"}
              onClick={() => contactLink(item.client.phone)}
            >
              {item.client.phone}
            </Button>
            <CopyBtn text={item.client.phone} />
          </div>
        );
      },
    },
    {
      key: "courseName",
      header: "البرنامج",
      display: (item) => item.courseName,
    },
    {
      key: "subscriptionStatus",
      header: "الحالة",
      display: (item) => (
        <BadgeDemo
          text={enumTranslations[item.subscriptionStatus]}
          type={item.subscriptionStatus}
        />
      ),
    },
    {
      key: "trainingTypeAtRegistration",
      header: "نوع التدريب",
      display: (item) => enumTranslations[item.trainingTypeAtRegistration],
    },
    {
      key: "createdAt",
      header: "تاريخ الإنشاء",
      display: (item) => formatDate(item.createdAt, "date"),
    },
  ];

  const tableProps: DataTableProps<SubscriptionWithClient> = {
    data: data?.items ?? [],

    maxPage: data?.pagination.totalPages ?? 1,

    isLimit: true,
    isSearch: true,
    isPagination: true,

    isLoading,

    headers,

    filters:
      page <= 1
        ? [
            {
              group: isLoadingAreas ? "جاري تحميل المناطق..." : "المناطق",
              option:
                areas?.items.map((area) => ({
                  key: "areaId",
                  label: area.name,
                  val: area.id,
                })) ?? [],
            },
          ]
        : undefined,

    actions: (item) => (
      <SubscriptionActions academyId={item.academyId} item={item} />
    ),

    noDataTableText: areaId
      ? "لا توجد اشتراكات نشطة في المنطقة المحددة."
      : "يرجى اختيار منطقة لعرض العملاء.",
  };

  const headerProps: PageHeaderProps = {
    title: "إدارة عملاء المناطق",
    description: "استعرض وأدر بيانات العملاء والاشتراكات حسب المنطقة المحددة.",
  };

  return (
    <section className="flex flex-col gap-6">
      <div className="bg-sidebar rounded-md p-4">
        <PageHeader {...headerProps} />
      </div>

      {data?.area ? (
        <div className="flex w-fit items-center gap-3 rounded-lg border bg-muted/50 px-4 py-3">
          <RiMapPinLine className="size-5 text-primary" />
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">
              المنطقة الحالية
            </span>
            <span className="font-semibold">{data.area.name}</span>
          </div>
        </div>
      ) : (
        <div className="flex w-fit items-center gap-3 rounded-lg border border-dashed bg-muted/30 px-4 py-3 text-muted-foreground">
          <RiMapPinLine className="size-5" />
          <div className="flex flex-col">
            <span className="text-xs">المنطقة الحالية</span>
            <span className="font-medium">لم يتم اختيار منطقة</span>
          </div>
        </div>
      )}

      <TableUi {...tableProps} />
    </section>
  );
}
