import {
  Space,
  Col,
  Table,
  Row,
  Modal,
  Tooltip,
  Input,
  Typography,
  Select,
} from 'antd';
import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  BiEdit,
  BiTrash,
  BiPlus,
  BiCheckCircle,
  BiChevronDownCircle,
  BiXCircle,
} from 'react-icons/bi';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useQueryClient } from '@tanstack/react-query';
import { debounce } from 'lodash';

import Button from '../../components/common/Button';
import { useListPost, useDeletePost, useApprovePost } from '../../hooks/post';
import { useListCategory } from '~/hooks/category';
import Loading from '~/components/common/Loading';
import {
  PAGE_SIZE,
  POST_LIST_KEY,
  permissions,
  postStatus,
  publishOptions,
} from '~/constants';
import { AdminContext } from '~/contexts/AdminContext';
import { BsFillFileEarmarkPdfFill } from 'react-icons/bs';
import { AiOutlineFileText } from 'react-icons/ai';
import { ellipsShortNameFile } from '~/utils/string';

const ListPost = () => {
  const { t } = useTranslation('common');
  const { admin } = useContext(AdminContext);
  const [openModal, setOpenModal] = useState(false);
  const [postIdDelete, setPostIdDelete] = useState(null);
  const [openNewsDetail, setOpenNewsDetail] = useState(false);
  const [newsDetail, setNewsDetail] = useState(null);
  const pageSizeRef = useRef(PAGE_SIZE);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: PAGE_SIZE,
      locale: { items_per_page: '/ trang' },
    },
    sorter: {
      sortColumn: '',
      sort: '',
    },
    search: '',
    category_id: null,
    publish: null,
    role: admin?.role,
  });
  const [ellipsis, setEllipsis] = useState({
    content_vi: true,
    content_en: true,
  });

  const { data: { data: dataPost = [], total } = {}, isLoading } =
    useListPost(tableParams);
  const { data: { data: dataCategory = [] } = {} } = useListCategory();
  const { mutate, isLoading: isLoadingDelete, isSuccess } = useDeletePost();
  const [isLoadingg, setIsLoading] = useState(false);
  const router = useRouter();
  const useColumns = (t, router, page, dataCategory) => {
    const { admin } = useContext(AdminContext);
    const { mutate, isLoading: isLoadingApprove } = useApprovePost();
    useEffect(() => {
      if (isLoadingApprove) {
        setIsLoading(true);
      } else {
        setIsLoading(false);
      }
    }, [isLoadingApprove]);
    return [
      {
        title: <div className="text-center">STT</div>,
        dataIndex: 'id',
        key: 'id',
        width: '1%',
        sortDirections: ['ascend', 'descend', 'ascend'],
        sorter: () => { },
        render: (text, t, index) => (
          <div>{(page - 1) * pageSizeRef.current + index + 1}</div>
        ),
      },
      {
        title: <div className="text-center">{t('common.feature_image')}</div>,
        width: '10%',
        render: (record) => {
          return (
            <div
              className="overflow-hidden"
              style={{ width: '80px', height: '80px' }}
            >
              <img
                className="overflow-hidden img-table"
                src={record.feature_image}
                alt=""
              />
            </div>
          );
        },
      },
      {
        title: <div className="text-center">{t('common.title')}</div>,
        dataIndex: 'title_vi',
        key: 'title_vi',
        render: (text, record) => (
          <Typography.Paragraph
            className="cursor-pointer text-blue"
            onClick={() => {
              setNewsDetail(record);
              setOpenNewsDetail(true);
            }}
            ellipsis={{ rows: 2 }}
          >
            {text}
          </Typography.Paragraph>
        ),
        sortDirections: ['descend', 'ascend', 'descend'],
        sorter: () => { },
      },
      {
        title: <div className="text-center">{t('category.name')}</div>,
        key: 'category_id',
        dataIndex: 'category_id',
        width: '20%',
        render: (text) => (
          <Typography.Text ellipsis={{ rows: 2 }}>
            {dataCategory?.find((category) => category.id === text)?.title_vi}
          </Typography.Text>
        ),
        sortDirections: ['descend', 'ascend', 'descend'],
        sorter: (a, b) => {
          let cateA = dataCategory.find(
            (category) => category.id === a.category_id
          );
          let cateB = dataCategory.find(
            (category) => category.id === b.category_id
          );
          return cateA.title_vi.localeCompare(cateB.title_vi);
        },
      },
      {
        title: <div className="text-center">Trạng thái</div>,
        key: 'publish',
        dataIndex: 'publish',
        width: '120px',
        sortDirections: ['ascend', 'descend', 'ascend'],
        sorter: () => { },
        render: (text) => {
          return (
            <p>
              {publishOptions.find((publish) => publish.value === text)?.label}
            </p>
          );
        },
      },
      {
        title: <div className="text-center">Duyệt</div>,
        dataIndex: 'approve',
        key: 'approve',
        sortDirections: ['ascend', 'descend', 'ascend'],
        render: (_, record) => (
          <div className="form-check form-switch flex justify-center">
            <input
              className="form-check-input"
              type="checkbox"
              id={`checkbox-${record.id}`}
              name={`checkbox-${record.id}`}
              checked={record.publish == postStatus.publish ? true : false}
              onChange={(e) =>
                mutate({
                  id: record.id,
                  publish:
                    record.publish === postStatus.publish
                      ? postStatus.private
                      : postStatus.publish,
                })
              }
            />
          </div>
        ),
      },
      {
        title: <div className="text-center">{t('common.action')}</div>,
        key: 'action',
        className: 'max-w-[100px]',
        width: '180px',
        render: (_, record) => {
          return (
            <Space size="middle" className="flex justify-center">
              <Tooltip placement="top" title="Sửa">
                <Button
                  className="btn-info btn"
                  onClick={() => router.push(`/post/edit?id=${record.id}`)}
                >
                  <div className="parent-icon text-white">
                    <BiEdit className="text-[22px]" />
                  </div>
                </Button>
              </Tooltip>
              <Tooltip placement="top" title="Xoá">
                <Button
                  className="btn-danger btn"
                  onClick={() => record.showModal(record.id)}
                >
                  <div className="parent-icon text-white">
                    <BiTrash className="text-[22px]" />
                  </div>
                </Button>
              </Tooltip>
            </Space>
          );
        },
      },
    ];
  };

  useEffect(() => {
    if (isLoading) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [isLoading]);

  useEffect(() => {
    if (isLoadingDelete) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [isLoadingDelete]);

  const columns = useColumns(
    t,
    router,
    tableParams.pagination.current,
    dataCategory
  );
  const handleDelete = () => {
    if (dataPost.length === 1) {
      setTableParams({
        ...tableParams,
        pagination: {
          ...tableParams.pagination,
          current: tableParams.pagination.current - 1,
        },
      });
    }
    mutate(postIdDelete);
  };
  const showModal = (postId) => {
    setOpenModal(true);
    setPostIdDelete(postId);
  };
  const handleOk = () => {
    handleDelete();
    setOpenModal(false);
  };
  const handleCancel = () => {
    setPostIdDelete(null);
    setOpenModal(false);
  };

  const handleDebounce = debounce((value) => {
    setTableParams({
      ...tableParams,
      pagination: {
        ...tableParams.pagination,
        current: 1,
      },
      search: value,
    });
  }, 500);

  const handleSearch = (e) => {
    handleDebounce(e.target.value.trim());
  };

  dataPost?.map((post) => {
    post.key = post.id;
    post.showModal = showModal;
    return post;
  });

  dataCategory?.map((category) => {
    category.value = category.id;
    category.label = category.title_vi;
    return category;
  });

  const onChange = (pagination, filters, sorter, extra) => {
    pageSizeRef.current = pagination.pageSize;
    setTableParams({
      ...tableParams,
      pagination: {
        ...pagination,
      },
      sorter: {
        sort: sorter?.order === 'ascend' ? 'asc' : 'desc',
        sortColumn:
          sorter?.columnKey === 'id' ? 'createdAt' : sorter?.columnKey,
      },
    });
  };
  const handleNewsDetailCancel = () => {
    setEllipsis({ content_en: true, content_vi: true });
    setOpenNewsDetail(false);
  };
  useEffect(() => {
    setTableParams({
      ...tableParams,
      role: admin?.role,
    });
  }, [admin]);
  return (
    <div className="card radius-15">
      <div className="card-body">
        <div className="card-title flex justify-between">
          <p className="text-[20px] font-semibold">Danh sách tin tức</p>
          <Tooltip placement="top" title="Thêm mới">
            <Button
              className="btn-success btn"
              onClick={() => router.push(`/post/create`)}
            >
              <div className="parent-icon text-white">
                <BiPlus className="text-[22px]" />
              </div>
            </Button>
          </Tooltip>
        </div>
        <hr className="my-4" />
        <div className="flex justify-start">
          <div className="">
            <label className="pr-[8px] font-semibold">Chọn thể loại : </label>
            <Select
              showSearch
              placeholder="Lựa chọn"
              onChange={(value) => {
                setTableParams({
                  ...tableParams,
                  category_id: value,
                  pagination: {
                    ...tableParams.pagination,
                    current: 1,
                  },
                });
              }}
              filterOption={(input, option) =>
                (option?.label ?? '')
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={[{ label: 'Lựa chọn', value: null }, ...dataCategory]}
              className="mr-4"
              style={{ width: '250px' }}
            />
          </div>
          <div className="">
            <label className="pr-[8px] font-semibold">Chọn trạng thái : </label>
            <Select
              showSearch
              placeholder="Lựa chọn"
              onChange={(value) => {
                setTableParams({
                  ...tableParams,
                  publish: value,
                  pagination: {
                    ...tableParams.pagination,
                    current: 1,
                  },
                });
              }}
              filterOption={(input, option) =>
                (option?.label ?? '')
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={
                admin?.role === permissions.content
                  ? [
                    { label: 'Lựa chọn', value: null },
                    ...publishOptions,
                  ].filter((sl) => sl.value !== postStatus.publish)
                  : [
                    { label: 'Lựa chọn', value: null },
                    ...publishOptions,
                  ].filter((sl) => sl.value !== postStatus.draft)
              }
              className="mr-4"
              style={{ width: '120px' }}
            />
          </div>
          <Input.Search
            placeholder={t('common.search')}
            className="mb-6 lg:max-w-[300px] xs:max-w-full"
            onSearch={(value) => {
              setTableParams({
                ...tableParams,
                pagination: {
                  ...tableParams.pagination,
                  current: 1,
                },
                search: value.trim(),
              });
            }}

            onChange={(e) => handleSearch(e)}
          />
        </div>
        <div className="">
          <Table
            columns={
              admin?.role === permissions.content
                ? columns.filter((cl) => cl.dataIndex !== 'approve')
                : columns
            }
            rowKey={(record) => record.id}
            dataSource={dataPost}
            onChange={onChange}
            pagination={{
              ...tableParams.pagination,
              total: total,
              showSizeChanger: true,
              position: ['bottomLeft'],
            }}
          />
          {isLoadingg ? (
            <div
              className="absolute w-full h-full opacity-80 z-20 top-0"
              style={{
                background: '#fafcff',
              }}
            >
              <Loading
                className="flex align-middle justify-center"
                style={{
                  top: '30%',
                  left: '45%',
                  position: 'absolute',
                }}
              ></Loading>
            </div>
          ) : (
            <div></div>
          )}
        </div>
      </div>

      <Modal
        title={t('common.delete_confirm')}
        open={openModal}
        onOk={handleOk}
        centered
        onCancel={handleCancel}
        footer={[
          <Button onClick={handleCancel} className="bg-blue mr-3" key="cancel">
            {t('common.cancel')}
          </Button>,
          <Button onClick={handleOk} className="bg-danger mr-3" key="confirm">
            {t('common.confirm')}
          </Button>,
        ]}
      />
      {/* modal news detail */}
      <Modal
        open={openNewsDetail}
        onCancel={handleNewsDetailCancel}
        width="80%"
        style={{ transition: 'all 0.2s linear', top: 20 }}
        okButtonProps={{ style: { display: "none" } }}
        cancelButtonProps={{ style: { display: "none" } }}
      >
        <Row className="mb-3">
          <p className="text-[20px] mt-[24px] font-semibold">
            Chi tiết tin tức : {newsDetail?.title_vi}
          </p>
        </Row>
        <div className="wp-modal-info">
          <Row className="item_modal-info">
            <Col className="label_modal-info" span={4}>
              {t('common.title')}
            </Col>
            <Col className="content_modal-info" span={20}>
              {newsDetail?.title_vi ?? 'Không có dữ liệu'}
            </Col>
          </Row>
          <Row className="item_modal-info">
            <Col className="label_modal-info" span={4}>
              {t('publication.title_en')}
            </Col>
            <Col className="content_modal-info" span={20}>
              {newsDetail?.title_en ?? 'Không có dữ liệu'}
            </Col>
          </Row>
          {/* <Row className="item_modal-info">
            <Col className="label_modal-info" span={4}>
              {t("common.feature_image")}
            </Col>
            <Col className="content_modal-info" span={20}>
              <img
                className="overflow-hidden img-table"
                src={newsDetail?.feature_image}
                alt=""
              />
            </Col>
          </Row> */}
          <Row className="item_modal-info">
            <Col className="label_modal-info" span={4}>
              {t('publication.description')}
            </Col>
            <Col className="content_modal-info" span={20}>
              {newsDetail?.description_vi ?? 'Không có dữ liệu'}
            </Col>
          </Row>
          <Row className="item_modal-info">
            <Col className="label_modal-info" span={4}>
              {t('publication.description_en')}
            </Col>
            <Col className="content_modal-info" span={20}>
              {newsDetail?.description_en ?? 'Không có dữ liệu'}
            </Col>
          </Row>
          <Row className="item_modal-info">
            <Col className="label_modal-info" span={4}>
              {t('publication.document')}
            </Col>
            <Col className="content_modal-info" span={20}>
              {(newsDetail?.feature_document) && JSON.parse(newsDetail?.feature_document)?.map((item, index) => {

                return (
                  <a
                    href={item}
                    target="_blank"
                    className="flex items-center align-middle mt-3 "
                    key={index}
                  >
                    <AiOutlineFileText
                      style={{ fontSize: '23px', color: '#4e77c1' }}
                    />
                    {
                      ellipsShortNameFile(item)
                    }
                  </a>
                )
              })

              }
            </Col>
          </Row>
          <Row className="item_modal-info">
            <Col className="label_modal-info" span={4}>
              {t('category.name')}
            </Col>
            <Col className="content_modal-info" span={20}>
              {newsDetail?.Category?.title_vi ?? 'Không có dữ liệu'}
            </Col>
          </Row>
          <Row className="item_modal-info">
            <Col className="label_modal-info" span={4}>
              {t('post.publish')}
            </Col>
            <Col className="content_modal-info" span={20}>
              {
                publishOptions.find(
                  (publish) => publish.value === newsDetail?.publish
                )?.label
              }
            </Col>
          </Row>
          <Row className="item_modal-info">
            <Col className="label_modal-info" span={4}>
              {t('publication.content')}
            </Col>
            <Col className="content_modal-info" span={20}>
              {newsDetail && (
                <>
                  <Typography.Paragraph
                    ellipsis={
                      ellipsis.content_vi
                        ? {
                          rows: 2,
                        }
                        : false
                    }
                  >
                    <div
                      className="customFontSize14px"
                      dangerouslySetInnerHTML={{
                        __html: newsDetail.content_vi,
                      }}
                    ></div>
                  </Typography.Paragraph>
                  <Button
                    onClick={() =>
                      setEllipsis({
                        ...ellipsis,
                        content_vi: !ellipsis.content_vi,
                      })
                    }
                    type="button"
                    className="btn-primary font-medium"
                  >
                    {ellipsis.content_vi ? 'Đọc thêm' : 'Rút gọn'}
                  </Button>
                </>
              )}
            </Col>
          </Row>
          <Row className="item_modal-info">
            <Col className="label_modal-info" span={4}>
              {t('publication.content_en')}
            </Col>
            <Col className="content_modal-info" span={20}>
              {newsDetail && (
                <>
                  <Typography.Paragraph
                    ellipsis={
                      ellipsis.content_en
                        ? {
                          rows: 2,
                        }
                        : false
                    }
                  >
                    <div
                      className="customFontSize14px"
                      dangerouslySetInnerHTML={{
                        __html: newsDetail.content_en,
                      }}
                    ></div>
                  </Typography.Paragraph>
                  <Button
                    onClick={() =>
                      setEllipsis({
                        ...ellipsis,
                        content_en: !ellipsis.content_en,
                      })
                    }
                    type="button"
                    className="btn-primary font-medium"
                  >
                    {ellipsis.content_en ? 'Đọc thêm' : 'Rút gọn'}
                  </Button>
                </>
              )}
            </Col>
          </Row>
        </div>
      </Modal>
    </div>
  );
};

export default ListPost;
