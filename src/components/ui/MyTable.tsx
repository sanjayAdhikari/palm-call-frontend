import React from "react";
import { ITableColumns } from "interfaces";
import { Pagination, Table } from "antd";
import { PAGE_SIZE } from "constant";
interface IProps {
  columns: ITableColumns<any>[];
  data: any[];
  isLoading?: boolean;
  hideHeader?: boolean;
  onRowClickHandler?: (data: any, index: number) => void;
  pagination?: {
    currentPage: number;
    totalDocs: number;
    onChange: (page: number) => void;
  };
}
function MyTable({
  columns,
  data,
  isLoading,
  onRowClickHandler,
  hideHeader,
  pagination,
}: IProps) {
  const onRowClick = (data: any, index: number): any => {
    typeof onRowClickHandler === "function" && onRowClickHandler(data, index);
  };
  return (
    <div className={"flex flex-col gap-2"}>
      <Table
        rowHoverable
        onRow={(data, index) => {
          return {
            onClick: () => onRowClick(data, index),
          };
        }}
        showHeader={!hideHeader}
        loading={isLoading}
        columns={columns}
        dataSource={data}
        pagination={false}
      />
      {pagination && (
        <div className={"flex justify-end"}>
          <Pagination
            current={pagination?.currentPage}
            onChange={(page, pageSize) => {
              pagination?.onChange(page);
            }}
            total={pagination?.totalDocs}
            pageSize={PAGE_SIZE}
            responsive={true}
            showSizeChanger={false}
          />
        </div>
      )}
    </div>
  );
}

export default MyTable;
