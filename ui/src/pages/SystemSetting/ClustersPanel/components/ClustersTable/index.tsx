import clusterPanelStyles from "@/pages/SystemSetting/ClustersPanel/index.less";
import { Divider, Space, Table, Tooltip } from "antd";
import { useModel } from "@@/plugin-model/useModel";
import { useContext } from "react";
import type { AlignType, FixedType } from "rc-table/lib/interface";
import { EditOutlined } from "@ant-design/icons";
import IconFont from "@/components/IconFont";
import DeletedModal from "@/components/DeletedModal";
import classNames from "classnames";
import type { ClusterType } from "@/services/systemSetting";
import { ClustersPanelContext } from "@/pages/SystemSetting/ClustersPanel";

type ClustersTableProps = {};
const ClustersTable = (props: ClustersTableProps) => {
  const { onChangeVisible, onChangeIsEditor, onChangeCurrentCluster } =
    useContext(ClustersPanelContext);
  const {
    doGetClustersList,
    listLoading,
    pagination,
    clusterList,
    doDeletedCluster,
  } = useModel("clusters");

  const column = [
    {
      title: "名称",
      dataIndex: "clusterName",
      align: "center" as AlignType,
      ellipsis: { showTitle: false },
    },
    {
      title: "描述",
      dataIndex: "description",
      align: "center" as AlignType,
      ellipsis: { showTitle: false },
    },
    {
      title: "Api Server",
      dataIndex: "apiServer",
      align: "center" as AlignType,
      ellipsis: { showTitle: false },
    },
    {
      title: "配置",
      dataIndex: "kubeConfig",
      align: "center" as AlignType,
      ellipsis: { showTitle: false },
    },
    {
      title: "操作",
      align: "center" as AlignType,
      width: 100,
      fixed: "right" as FixedType,
      dataIndex: "operations",
      render: (_: any, record: ClusterType) => {
        return (
          <Space>
            <Tooltip title={"编辑"}>
              <EditOutlined
                onClick={() => {
                  if (
                    onChangeCurrentCluster &&
                    onChangeVisible &&
                    onChangeIsEditor
                  ) {
                    onChangeCurrentCluster(record);
                    onChangeIsEditor(true);
                    onChangeVisible(true);
                  }
                }}
                className={clusterPanelStyles.icon}
              />
            </Tooltip>
            <Divider type="vertical" />
            <Tooltip title={"删除"}>
              <IconFont
                onClick={() =>
                  DeletedModal({
                    onOk: () => {
                      if (record.id)
                        doDeletedCluster
                          .run(record.id)
                          .then(() => doGetClustersList());
                    },
                    content: `确认删除集群：${record.clusterName} 吗？`,
                  })
                }
                className={classNames(clusterPanelStyles.icon)}
                type={"icon-delete"}
              />
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  return (
    <div className={clusterPanelStyles.table}>
      <Table
        rowKey={"id"}
        loading={listLoading}
        columns={column}
        dataSource={clusterList}
        size={"small"}
        pagination={{
          total: pagination?.total,
          pageSize: pagination?.pageSize,
          current: pagination?.current,
          onChange: (current, pageSize) =>
            doGetClustersList({ current, pageSize }),
          responsive: true,
          showSizeChanger: true,
          size: "small",
        }}
      />
    </div>
  );
};
export default ClustersTable;