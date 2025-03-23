import { Column, ColumnDef } from "@tanstack/react-table";

export type DataTableMeta = {
    className?: string;
};

export interface DataTableProps<TData> {
    data: TData[];
    columns: ColumnDef<TData>[];
    isLoading?: boolean;
    emptyState?: {
        title: string;
        description?: string;
    };
    defaultSorting?: { id: string; desc: boolean }[];
    onRowClick?: (row: TData) => void;
    className?: string;
}

declare module "@tanstack/react-table" {
    interface ColumnMeta<TData, TValue> {
        className?: string;
        actions?: (row: TData) => React.ReactNode;
    }
}

export type DataTableColumnProps<TData> = {
    column: Column<TData>;
    className?: string;
};

export type DataTableCellProps<TData> = {
    value: any;
    row: TData;
    column: Column<TData>;
    className?: string;
};
