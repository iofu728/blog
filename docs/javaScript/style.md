---
pageClass: custom-page-class
---

# Style

TAISHAN 使用样式参考AntD Pro，但略有不同，除外界引入组件外使用.css定义组件样式

基本样式采用左侧可收缩菜单栏，上方固定头部设定。

全局layout见layouts/目录

## 颜色定制

* 这其实是TAISHAN第三版大改的一个动力

* 因为用过AntD Sider组件的同学应该都知道，AntD这个组件虽然很方便，但稍微丑了点

* 不支持颜色定制，只有白和黑两种颜色，导致，A端大部分AntD做的项目都是一个样子，黑色边栏，亮蓝色组件，左边栏还特别长，不能更改。

* 为解决这个问题，使用了深度定制AntD的umi框架，修改了组件颜色为 #07527a

* 未解决Sider样式较为丑的问题，舍弃使用AntD的Sider组件，利用Menu+css搭建，并约定不能使用SubMenu

* 对Header，利用css进行优化处理

## flex

* 对于css构建中，推荐使用flex
* flex最大的好处是方便实现居中

```css
.center {
  display: flex;
  justify-content: center;
  align-items: center
}
```
* 其他，就注意把所有组件尤其是，Table组件的Style定义到Css中，方便以后重构

## 一般结构

### Group搜索栏 + Table

参考 flow List 等页
```jsx harmony

 const target = !filter.groupId ? null : groupList.filter(item => item.id === Number.parseInt(filter.groupId, 10))[0];
 const defaultValue = !filter.groupId ? {} : { defaultValue: target.name };

  return (
       <div className={styles.normal}>
         <div>
           <div className={globalStyles['edit-column-page']}> // 上层白底css封装
             <span className={globalStyles['margin-left-20']}>分组名：</span>
             <Select
               showArrow
               allowClear
               showSearch
               {...defaultValue}
               placeholder="请选择分组"
               optionFilterProp="children"
               onChange={groupId => this.handleChangeSelect(groupId)(filter)}
               defaultActiveFirstOption={false}
               className={globalStyles['select-column']}
               filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
             >
               {groupList.map(d => <Option key={d.id}>{d.name}</Option>)}
             </Select>

             // 右对齐Css
             <FlowModal record={{ flowName: '' }} type={'create'}><Button className={globalStyles['button-column']} type="primary" icon="plus">添加接口</Button></FlowModal>
           </div>
           <div className={globalStyles.empty}/> // 灰色隔断层css封装
           <div className={globalStyles['content-text']}> // 正文Css
             <Table
               rowKey={record => record.flowId}
               columns={columns}
               dataSource={flowList}
               onChange={(pagination, filters, sorter) => this.handleTableChange(pagination)(filter)(sorter)}
               loading={listLoad}
               pagination={tablePagination}
             />
           </div>
         </div>
       </div>
     );
   }
```

### PageHeader

参考Task report、TaskFlow Report、Resource

```jsx harmony
return (
      <div className={styles.normal}>
        <div>
          <div className={globalStyles['edit-column-page']}>
            <PageHeader
              title={pageTitle}
              logo={<img alt="" src={logoUrlArray[taskId - Math.floor(taskId / 5) * 5]}/>}
              action={action}
              content={description}
              extraContent={extra}
              breadcrumbList={breadcrumbList}
              tabList={tabList}
              tabActiveKey={activeTabKey}
              onTabChange={activeTabKeys => {this.setState({ activeTabKey: activeTabKeys }); if (activeTabKeys === 'log') {this.fetchTaskLog();}}}
            />
          </div>
          <div className={globalStyles.empty}/>
          {activeTabKey === 'detail' &&
          <div>
            <div className={globalStyles['content-text']}>
              <ChartCard
                contentHeight={45}
                footer={
                  <div>
                    <span>改变率<Trend flag={moreAchievedRate ? 'up' : 'down'} className={globalStyles.trend}><b>{achievedRateChanged}</b></Trend></span>
                    <span className={globalStyles['margin-left-15']}>同比(相对于30s前）
                      <Trend flag={moreAchievedRate30sAgo ? 'up' : 'down'} className={globalStyles.trend}><b>{achievedRateChanged30sAgo}</b></Trend>
                    </span>
                    <span className={globalStyles['margin-left-15']}>耗时：<b className={globalStyles.code}>{this.getTime()}</b></span>
                  </div>
                }
              >
                <NumberInfo subTitle="Flow达标进度" total={cal}/>
                <MiniProgress percent={!total ? 0 : successTaskFlow * 100 / total} strokeWidth={8} target={80}/>
              </ChartCard>
            </div>
            <div className={globalStyles.empty}/>
            <div className={globalStyles['content-text']}>
              <Table
                rowKey={record => record.id}
                loading={infoLoad}
                pagination={pagination}
                columns={aColumns}
                dataSource={taskData}
              />
            </div>
          </div>
          }
          {activeTabKey === 'agent' &&
          <div className={globalStyles['content-text']}>
            <Spin spinning={!taskData.length}>
              <Table
                rowKey="id"
                loading={infoLoad || !taskData.length}
                pagination={false}
                columns={agentColumns}
                dataSource={engineSet}
              />
            </Spin>
          </div>
          }
          {activeTabKey === 'log' &&
          <div className={globalStyles['content-text']}>
            <div className={styles.timeLine}>
              <Timeline pending={running === 1 ? '正在运行...' : running === 3 ? '暂停中...' : false}>
                {taskLog.map(r =>
                  <Timeline.Item color={r.desc.includes('停止') || r.desc.includes('取消') ? '#DC143C' : '#1DA57A'}>
                    {r.desc === '耗时' ? <span><span className={styles['timeline-detail']}>{r.desc}</span> <span className={globalStyles.code}>{r.timeStamp}</span> </span> :
                      <span>
                        <span className={styles['code-log']} {...logFontSize}>{r.timeStamp}</span> <span className={styles['timeline-detail']}>{r.desc}</span>
                      </span>}
                  </Timeline.Item>)}
              </Timeline>
            </div>
          </div>
          }
        </div>
      </div>
    );
```

### Other

其他对`DataPicker`等进行参数、样式调优

```jsx
 <RangePicker
     dateRender={current => {
       const style = {};
       if (current.date() === 1) {
         style.border = '1px solid #07527a';
         style.borderRadius = '50%';
       }
       return <div className="ant-calendar-date" style={style}>{current.date()}</div>;
     }}
     showTime
     allowClear
     {...defaultTime}
     format="YYYY-MM-DD HH:mm"
     onOk={value => this.handleDatePicker(value)(filter)}
     onChange={value => this.handleClearDate(value)(filter)}
     placeholder={['开始时间', '结束时间']}
     className={styles['list-RangePicker']}
     disabledDate={current => current && current > moment().endOf('day')}
     ranges={{ '过去一天': [moment().subtract(1, 'day'), moment()],
       '过去一星期': [moment().subtract(7, 'day'), moment()],
       '上星期': [moment().subtract(7 * 2, 'day'), moment().subtract(7, 'day')] }}
  />
```

## Modal 写法

通过props.children 传入children

```jsx harmony
      <span>
        <span onClick={this.showModelHandler}>
          { children }
        </span>
        <Modal
          title={type !== 'delete' ? '确认压测计划' : '取消压测计划'}
          visible={visible}
          onOk={this.okHandler}
          onCancel={this.hideModelHandler}
        >
        </Modal>
      </span>
```

