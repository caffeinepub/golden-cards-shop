import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface Item {
    productId: bigint;
    quantity: bigint;
}
export interface CreateOrderInput {
    customerName: string;
    total: bigint;
    address: string;
    phone: string;
    items: Array<Item>;
}
export interface Order {
    id: bigint;
    customerName: string;
    status: Status;
    total: bigint;
    createdAt: Time;
    address: string;
    phone: string;
    items: Array<Item>;
}
export interface Product {
    id: bigint;
    name: string;
    description: string;
    series: Series;
    imageUrl: string;
    price: bigint;
}
export enum Series {
    naruto = "naruto",
    pokemon = "pokemon"
}
export enum Status {
    shipped = "shipped",
    pending = "pending",
    delivered = "delivered",
    processing = "processing"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createOrder(input: CreateOrderInput): Promise<bigint>;
    getCallerUserRole(): Promise<UserRole>;
    getOrders(): Promise<Array<Order>>;
    getProduct(id: bigint): Promise<Product>;
    getProducts(): Promise<Array<Product>>;
    getSeriesText(series: Series): Promise<string>;
    initialize(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    updateOrderStatus(orderId: bigint, status: Status): Promise<void>;
    recordVisit(): Promise<void>;
    getVisitCount(): Promise<bigint>;
}
