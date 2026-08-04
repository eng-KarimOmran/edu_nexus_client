import type { LessonStatus, PaymentMethod } from "@/types/enums";
import type { Car } from "../car/car.type";
import type { PaginatedResponse } from "@/types/axios";
import type { SubscriptionWithClient } from "../subscription/subscription.type";
import type { Area } from "../area/area.type";

export interface wallets {
    id: string;
    balance: number;
    academy: {
        id: string;
        name: string;
    };
}

export interface EmployeeWithDebts {
    id: string;
    user: {
        id: string;
        name: string;
        phone: string;
    };
    wallets: wallets[]
}

export interface Lesson {
    id: string;
    startTime: string;
    endTime: string;
    lessonStatus: LessonStatus;
    expectedPaymentAmount: number

    car: {
        id: string;
        modelName: string;
        plateNumber: string;
    };

    area: {
        id: string;
        name: string;
    };

    client: {
        id: string;
        name: string;
        phone: string;
    };

    academy: {
        id: string;
        name: string;
    };

    jobProfile: {
        id: string;
        user: {
            id: string;
            name: string;
            phone: string;
        };
    };

    subscription: {
        id: string,
        courseName: true
        totalSessions: number,
        lessons: { id: string }[]
    }
}

export interface BaseLesson {
    id: string
    startTime: string,
    endTime: string,
    subscriptionId: string,
    academyId: string,
    expectedPaymentAmount: string,
    client: {
        id: string,
        name: string,
        phone: string
    }
    jobProfile: {
        id: string,
        user: {
            id: string,
            name: string,
            phone: string
        }
    },
    area: {
        id: string,
        name: string,
    },

    subscription: {
        totalSessions: number,
        lessons: { id: string }[]
    }
}

export interface CarWithLessons extends Car {
    lessons: BaseLesson[]
}

export interface EmployeeWithLessons {
    id: string;
    name: string;
    phone: string;
    jobProfile: {
        id: string;
        lessons: {
            id: string;
            expectedPaymentAmount: number;
            startTime: string;
            lessonStatus: LessonStatus;

            walletMovement: {
                id: string;
                amount: number;
                paymentMethod: PaymentMethod;
            } | null;

            academy: {
                id: string;
                name: string;
            };

            area: {
                id: string;
                name: string;
            };

            car: {
                id: string;
                modelName: string;
                plateNumber: string;
            };

            client: {
                id: string;
                name: string;
                phone: string;
            };

            subscription: {
                id: string, courseName: string
            },
        }[];
    };
}

export type AreaWithSubscriptionResponse = PaginatedResponse<
    SubscriptionWithClient,
    {
        area: Area;
    }
>;