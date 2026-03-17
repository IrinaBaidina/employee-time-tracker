import { getNestedValue, NestedKeys } from "@/utils/ObjectsUtils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table";
import { cn } from "@/lib/utils";


export interface TableColumn<T> {
  header?: string;
  key: React.Key;
  subHeaders?: TableColumn<T>[];
  headerClassName?: string;
  rowClassName?: string;
  children?: React.ReactNode;
  width?: string;
  render?: (item: T, index: number) => React.ReactNode; // кастомная отрисовка
  accessor?: NestedKeys<T>; // простой доступ к свойству
}


interface GenericTableProps<T> {
  className?: string;
  headerClassName?: string;
  columns?: TableColumn<T>[]; // можно оставить необязательным, если рендер строк кастомный
  data?: T[] | T;
  rowKey: (item: T) => string;
  rowRenderer?: (item: T, index: number) => React.ReactNode;
  noHeader?: boolean;
  noBody?: boolean;
  fixedLayout?: boolean;
}

const calculateColSpan = <T,>(coolumn: TableColumn<T>) => {
  let colSpan = 0;
  const stack = [coolumn];
  while (stack.length > 0) {
    const col = stack.pop()!;
    if (col.subHeaders && col.subHeaders.length > 0)
      stack.push(...col.subHeaders)
    else
      colSpan += 1;
  }
  return colSpan;
}
export function GenericTable<T>({
  className,
  headerClassName,
  columns,
  data,
  rowKey,
  rowRenderer,
  noHeader,
  noBody,
  fixedLayout = false,
}: GenericTableProps<T>) {
  const createHeaders = () => {
    const headers = [];
    let currentLevel = columns;
    let nextLevel: TableColumn<T>[] = [];
    if (currentLevel) {
      while (currentLevel.length > 0) {
        headers.push(
          <TableRow key={`${currentLevel[0].header} - ${currentLevel[currentLevel.length - 1].header}`} className={cn("h-auto", !noHeader && "border-b-2")}>
            {currentLevel.map((col) => {
              const colSpan = calculateColSpan(col);
              return (
                <TableHead key={col.key || col.header} className={col.headerClassName} colSpan={colSpan}>
                  {col.header}
                  {col.children}
                </TableHead>
              )
            })}
          </TableRow>
        );
        nextLevel = [];
        for (const col of currentLevel) {
          if (col.subHeaders && col.subHeaders.length > 0)
            nextLevel.push(...col.subHeaders);
        }
        currentLevel = nextLevel;
      }
    }
    return headers;
  }
  const createRows = () => {
    if (!data)
      return;
    if (data instanceof Array) {
      return data.map((item, idx) =>
        rowRenderer ? (
          rowRenderer(item, idx)
        ) : (
          <TableRow key={rowKey(item)}>
            {columns?.map((col, colIdx) => (
              <TableCell key={colIdx} className={col.rowClassName}>
                {col.render
                  ? col.render(item, idx)
                  : col.accessor
                    ? (getNestedValue(item, col.accessor) as React.ReactNode)
                    : null}
              </TableCell>
            ))}
          </TableRow>
        )
      )
    }
    return rowRenderer ? rowRenderer(data, 0) :
      <TableRow key={rowKey(data)}>
        {columns?.map((col, colIdx) => (
          <TableCell key={colIdx} className={col.rowClassName}>
            {col.render
              ? col.render(data, 0)
              : col.accessor
                ? (getNestedValue(data, col.accessor) as React.ReactNode)
                : null}
          </TableCell>
        ))}
      </TableRow>
  }
  return (
    <div className={cn("size-full animate-fade-in", className)}>
      <Table className={cn(fixedLayout && "table-fixed w-full", "border-separate border-spacing-0")}>
        {columns && !noHeader && (
          <TableHeader className={headerClassName}>
            {createHeaders()}
          </TableHeader>
        )}
        {!noBody && <TableBody>{createRows()}</TableBody>}
      </Table>
    </div>
  );
}