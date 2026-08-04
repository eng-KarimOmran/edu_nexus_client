import { useQuery } from "@tanstack/react-query";
import type { GetAreaWithSubscriptionDto } from "../employee.dto";
import { getAreaWithSubscription } from "./employee.service";
import { queryKey } from "@/features/subscription/subscription.constants";

export const useAreaWithSubscription = (
    query: GetAreaWithSubscriptionDto["query"],
) => {
    return useQuery({
        queryKey: [...queryKey, query],
        queryFn: () => getAreaWithSubscription({ query }),
        select: (res) => res.data.data,
        enabled: !!query.areaId
    });
};