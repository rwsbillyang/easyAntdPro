# 1. easy-antd-pro
- Easy to use [antd-pro](https://github.com/ant-design/ant-design-pro) because more out-of-box.
- For use in pure react app, not need [umi](https://umijs.org/en-US),  super lightweight.


## 1.1. Add dependency
```shell
npm i easy-antd-pro
```



## 1.2. EasyProTable


### 1.2.1. Features

- Not need request、params、datasource, only need listApi url.
- First time table list data loaded from remote server would be cached automatically if provide cacheKey,  next time load directly from cache.
- Search conditions would be cached automatically.
- Support initial query contions when load table data.
- Support load more instead of  total pages
- Support async load select options data from remote if provide url and parameters.
- Support del if provide delApi url
- Support customize toolBarRender, default is New/Add Button.

### 1.2.2. Example code

#### 1.2.2.1. Simplest Table with CRUD

```typescript
export const DomainTable: React.FC = () => {
  const name = "domain"

  const columns: ProColumns<Domain>[] = [
    {
      title: '名称',
      dataIndex: 'label',
      formItemProps: mustFill,
    }
  ]
  
  const props = defaultProps(name) 

  return <EasyProTable<Domain, DomainQueryParams> {...props}  columns={columns}   />
}
```
Only need code:
- Biz code, like Domain and DomainQueryParams
- Biz columns and name

Then we get a table with feature:
- show list with load more
- support add, edit, del one
- support search query



defaultProps function:
```typescript
/**
 * 
 * @returns 返回 EasyProTableProps的部分属性
 */
export function defaultProps(name: string, cacheTable: boolean = true, supportDel: boolean = true, supportAdd: boolean = true) {
    const host =  "" // could be other host

    return {
      idKey: "id",
      name: name,
      cacheKey: cacheTable? name: undefined,
      listApi: `${host}/api/YourPath/list/${name}`,
      delApi: supportDel?  `${host}/api/YourPath/del/${name}` : undefined, 
      saveApi: supportAdd? `${host}/api/YourPath/save/${name}` : undefined, 
    }
  }
```


#### 1.2.2.2. Async Select Options
```typescript
{
      title: '所属',
      key: "domainId",
      dataIndex: ['domain', 'label'],
      //search:{transform:(v)=>{return {domainId: v}}},//转换form字段值的key，默认为dataIndex确定，转换后 将使用 domainId, 选中后值为v
      request: () => asyncSelectProps2Request<Domain, DomainQueryParams>({
        key: AllDomainKey, //cache key
        url: `${Host}/api/rule/composer/list/domain`,
        query: { pagination: { pageSize: -1, sKey: "id", sort: 1 } }, //pageSize: -1 means load all
        convertFunc: (item) => { return { label: item.label, value: item.id } }
      })
    },
```


#### 1.2.2.3. transformBeforeSave/transformBeforeEdit

If need transform front-end biz data before sumitting to remote server, please use `transformBeforeSave`,  and accodingly transform the data from remote server to front-end biz data, please use `transformBeforeEdit`.

```typescript
export const ConstantTable: React.FC = () => {
  const name = "constant"

  const [searchParams] = useSearchParams();
  const initialQuery = { domainId: searchParams["domainId"], typeId: searchParams["typeId"] }


  const columns: ProColumns[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
   //...
  ]

    //for edit different from list
  const formColumns: ProFormColumnsType<Constant>[] = [
    //...
  ]


  //transform before submission
  const transformBeforeSave = (e: Constant) => {
    //console.log("transformBeforeSave Constant=", e)
    if (e.typeInfo) {
      e.jsonValue = { _class: e.typeInfo.label + (e.isEnum ? "Enum" : ""), v: e.jsonValue?.v }//若选择枚举，则存储类型为容器。故_class加上Set
      e.typeId = +e.typeInfo.value
      delete e.typeInfo
      e.value = JSON.stringify(e.jsonValue)
    }

    delete e.paramType
    delete e.domain
    delete e.jsonValue

    return e
  }


  const transformBeforeEdit = (e?: Partial<Constant>) => {
    if (e?.paramType)
      e.typeInfo = { label: e.paramType.code, value: e.paramType.id || "" }

    if (e?.value) {
      e.jsonValue = JSON.parse(e.value)
    }
    return e
  }

  const props: EasyProTableProps<Constant, ConstantQueryParams> = { ...defaultProps(name), transformBeforeSave, transformBeforeEdit }

  return <EasyProTable<Constant, ConstantQueryParams> {...props} columns={columns} formColumns={formColumns} initialValues={{ isEnum: false }} initialQuery={initialQuery} />
}
```

#### 1.2.2.4. Customize toolBarRender

```typescript
export const BasicExpressionTable: React.FC = () => {
  const name = "expression"
  const [searchParams] = useSearchParams();
  const initialQuery: ExpressionQueryParams = { domainId: searchParams["domainId"], type: 'Basic' }


  //新增和编辑将全部转移到自定义的BaiscExpressionEditor
  const toolBarRender = () => [
    <BaiscExpressionRecordEditor isAdd={true} record={{ type: "Basic" }} tableProps={props} key="addOne" />
  ]

  //自定义编辑
  const actions: ProColumns<BasicExpressionRecord> = {
    title: '操作',
    valueType: 'option',
    dataIndex: 'actions',
    render: (text, row) => [
      <BaiscExpressionRecordEditor isAdd={false} record={props.transformBeforeEdit ? props.transformBeforeEdit(row) : row} tableProps={props} key="editOne" />,
      <a onClick={() => deleteOne(row, props.delApi + "/" + row[(props.idKey || UseCacheConfig.defaultIdentiyKey || "id")], undefined, props.listApi, props.cacheKey, props.idKey)} key="delete">删除</a>
    ]
  }



  return <EasyProTable<BasicExpressionRecord, ExpressionQueryParams>
    {...props}
    columns={[...columns]}  //use new instance
    initialQuery={initialQuery}
    toolBarRender={toolBarRender} actions={actions}
  />
}
```


#### 1.2.2.5. listTransform/listTransformArgs

The list data could be transformed using listTransform in EasyProTable.

expandable and onExpand are used to load subtree data when click expandable icon.

```typescript
export const RuleGroupTable: React.FC = () => {
    const [loadingTypeId, setLoadingTypeId] = useState<string>() //loading 
    const [path, setPath] = useState<string[]>()

     //...

    const expandable: ExpandableConfig<RuleCommon> = {
        indentSize: 5,
        expandIcon: ({ expanded, onExpand, record }) => {
            if (loadingTypeId === record.typedId)
                return <Spin size="small" />
            else {
                if (record.children) {
                    return expanded ? (
                        <MinusCircleTwoTone onClick={e => onExpand(record, e)} />
                    ) : (
                        <PlusCircleTwoTone onClick={e => onExpand(record, e)} />
                    )
                } else {
                    return undefined
                }
            }
        },
        onExpand: (expanded, record) => {
            if (expanded && record.children?.length === 0) {
                setLoadingTypeId(record.typedId)
                const name = (record.rule)? RuleName : RuleGroupName
                cachedFetch<RuleCommon[]>({
                    url: `/api/rule/composer/loadChildren/${name}/${record.id}`,
                    method: "GET",
                    isShowLoading: false,
                    onOK: (data) => {
                        setLoadingTypeId(undefined)
                        data.forEach((e) => {
                            e.posPath = [...record.posPath, e.posPath[0]]
                        })
                        record.children = data

                        dispatch("loadChildrenDone-" + rubleGroupTableProps.listApi)
                    },
                    onNoData: () => {
                        setLoadingTypeId(undefined)
                        message.warning("no data return")
                    },
                    onKO: (code, msg) => {
                        setLoadingTypeId(undefined)
                        message.error(code + ": " + msg)
                    },
                    onErr: (errMsg) => {
                        setLoadingTypeId(undefined)
                        message.error("err: "+ errMsg)
                    }
                })
            }
        }
    }

    return <>
        <EasyProTable<RuleCommon, RuleGroupQueryParams>
            {...rubleGroupTableProps}
            expandable={expandable}
            columns={ruleGroupColumns}
            initialQuery={initialQuery}
            initialValues={initialValuesRuleGroup}
            listTransformArgs={path}
            listTransform={(list: RuleCommon[], args?: any) => {
           
                current.treeData = list //记录下当前全部树形数据

                //console.log("after trim, list=",list)

                if (!args) return list
                const root = ArrayUtil.trimTreeByPath(list, args, rubleGroupTableProps.idKey)

                return root ? [root] : list
            }}

            rowKey={ (record) => record.posPath.join('-')  }
            toolBarRender={toolBarRender} actions={actions}
        />
        <MoveIntoNewParentModal param={moveParam} setParam={setMoveParam} />
    </>
}
```


#### 1.2.2.6. Other properties in EasyProTableProps

- disableDel:  disable delete feature
- needLoadMore: not need load more feaure when load all data

```typescript
export const OpcodeTable: React.FC = () => {
  const name = "opcode"

  const initialValue: Partial<Opcode> = { isSys: false, type: 'Customize' }
  const props: EasyProTableProps<Opcode, OpcodeQueryParams> = {
    ...defaultProps(name),
    needLoadMore: false,
    initialValues: initialValue,
    disableDel: (e) => e.isSys,
    transformBeforeSave,
    transformBeforeEdit
    //disableEdit: (e) => e.isSys,
    //editForm: (e) => e?.isSys === false ? 'ModalForm' : undefined
  }

//...

  return <EasyProTable<Opcode, OpcodeQueryParams> {...props}
    initialQuery={initialQuery} columns={sysColumns}
    toolBarRender={toolBarRender} actions={actions} />
}
```


- lastIdFunc: get lastId from list item for loadMore
- editForm:  where navigate when not use default editor

```typescript
export const rubleTableProps = {
    ...defaultProps(RuleName), 
    idKey: "typedId",
    lastIdFunc: (e: RuleCommon) => e.rule?.id?.toString() || "",
    editForm: (e) => '/rule/editRule',

}
```


## 1.3. EasyProLayout

A ProLayout based on react-router-dom for navigatiron.


### 1.3.1. Config Routes
```typescript
//main.tsx
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
)


//App.tsx
function App() {
  //UseCacheConfig.EnableLog = false
  return useRoutes(AppRoutes);
}
export default App;


//AppRoutes.tsx
// put all routes here
const menuRoutes: EasyRoute[] = [
  {
    path: '/meta',
    id: 'meta',
    icon:<ProfileOutlined />,
    name: "元数据",
    //element: lazyLoad(<Page2 />),//优先级高于children
    children: [
      {
        path: '/meta/type',
        name: '类型',
        element: lazyLoad(<ParamTypeTable />)
      },
    //...
    ]
  },
  //...
]

export const AppRoutes: RouteObject[] = [
  {
    path: '/',
    //element: <EasySimpleLayout menuRoutes={menuRoutes} navRoutes={actions}/>,
    element: <EasyProLayout {...proLayoutProps} />,
    children: menuRoutes as RouteObject[]  //路由嵌套，子路由的元素需使用<Outlet />
  },
//...
  EnableDev? {
    path: '/dev',
    element: lazyLoad(<DevHome />)
  } : {
    path:"/tmp"
  }
].filter(e=> e.path !== "/tmp")



export const lazyLoad = (children: ReactNode): ReactNode => {
  return <Suspense fallback={<div>Loading...</div>}>
    {children}
  </Suspense>
}
```

### 1.3.2. EasyProLayoutProps

Basically same as ProLayoutProps:
```typescript
export interface EasyProLayoutProps extends ProLayoutProps{
    dark?: boolean
}
```

An example:
```typescript
const proLayoutProps: EasyProLayoutProps = {
  title: "Rule Composer",
  //logo: null,
  //layout: 'mix',
  //dark: true, //bugfix sidebar弹出菜单与菜单字体色一致看不清

  route: {
    path: '/',
    children: menuRoutes  //路由嵌套，子路由的元素需使用<Outlet />
  },
  //siderMenuType: "group",
  menu: {
    collapsedShowGroupTitle: true,
    locale: true
  },
  menuFooterRender: (props) => {
    if (props?.collapsed) return undefined;
    return (
      <div
        style={{
          textAlign: 'center',
          paddingBlockStart: 12,
        }}
      >
        <div> © 2023 RuleComposer</div>
        <div>by rwsbillyang@qq.com</div>
      </div>
    );
  },
  actionsRender: (props) => {
    if (props.isMobile) return [];
    return [
      <Tooltip title="清除缓存"><ClearOutlined key="ClearOutlined" onClick={() => {
        Cache.evictAllCaches()
        message.info("清除完毕")
      }} /></Tooltip>,
      <Tooltip title="中文/Engilish"><TranslationOutlined key="TranslationOutlined" /></Tooltip>,
      <Tooltip title="版本"><InfoCircleOutlined key="InfoCircleFilled" /></Tooltip>,
      <Tooltip title="GitHub"><a href="https://github.com/rwsbillyang/RuleEngine" target="_blank"><GithubFilled key="GithubFilled"/></a></Tooltip>,
    ];
  }
}
```

