import { Col, Input, Menu, Row, Typography } from 'antd';
import React from 'react';
import { HomeFilled, SearchOutlined } from '@ant-design/icons';
import { useTranslation } from 'next-i18next';

const Menus = () => {
  const { t } = useTranslation('common');
  return (
    <Row className='flex items-center justify-between bg-blue pl-[60px] pr-[40px]'>
      <Menu
        mode='horizontal'
        className='bg-blue'
        items={[
          {
            key: 'item1',
            icon: (
              <HomeFilled
                className='text-white'
                style={{ color: '#fff', fontSize: '18px' }}
              />
            ),
          },
          {
            label: (
              <Typography.Text className='uppercase text-white font-normal'>
                {t('home.introduce')}
              </Typography.Text>
            ),
            key: 'item2',
          },
          {
            label: (
              <Typography.Text className='uppercase text-white font-normal'>
                {t('home.news')}
              </Typography.Text>
            ),
            key: 'item3',
          },
          {
            label: (
              <Typography.Text className='uppercase text-white font-normal'>
                {t('home.introduce_commercial')}
              </Typography.Text>
            ),
            key: 'item4',
          },
          {
            label: (
              <Typography.Text className='uppercase text-white font-normal'>
                {t('home.public_service')}
              </Typography.Text>
            ),
            key: 'item5',
          },
          {
            label: (
              <Typography.Text className='uppercase text-white font-normal'>
                {t('home.contact')}
              </Typography.Text>
            ),
            key: 'item6',
          },
        ]}
      />
      <Col span={5} className="">
        <Row className='relative'>
          <SearchOutlined style={{ color: 'var(--blue)', fontSize: '16px' }} className="absolute z-10 top-[50%] left-2 translate-y-[-50%]"/>
          <Input
            placeholder={t('home.search')}
            className='text-blue text-[12px] font-medium pl-8'
          />
        </Row>
      </Col>
    </Row>
  );
};

export default Menus;
