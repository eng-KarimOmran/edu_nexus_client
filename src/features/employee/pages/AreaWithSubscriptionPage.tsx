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

export default function AreaWithSubscriptionPage() {
  const [searchParams] = useSearchParams();

  const page = Math.max(1, Number(searchParams.get("page") ?? 1));

  const limit = Math.max(10, Number(searchParams.get("limit") ?? 10));

  const { data: areas, isLoading: isLoadingAreas } = useAreas({
    page: 1,
    limit: 100,
    isActive: true,
  });

  const areaId = searchParams.get("areaId") ?? "";

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

    filters: [
      {
        group: isLoadingAreas ? "جاري تحميل المناطق..." : "المناطق",
        option:
          areas?.items.map((area) => ({
            key: "areaId",
            label: area.name,
            val: area.id,
          })) ?? [],
      },
    ],

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

      <div>{data?.area.name}</div>
      <TableUi {...tableProps} />
    </section>
  );
}