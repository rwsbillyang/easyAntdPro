import { EasyProConfig } from "./EasyProConfig";
import  {EasyProLayout, EasyProLayoutProps } from "./EasyProLayout";
import { EasyRoute } from "./EasyProRoute";
import { EasyProTable, EasySchemaFormEditor, UpdateTreeNodeParams, deleteOne, saveOne } from "./EasyProTable";
import { EasyAsyncSelectProps, EasyProTableProps, EditProps, asyncSelect2Request, asyncSelectProps2Request } from "./EasyProTableProps";
import { EasySimpleLayout, routesToMenu } from "./EasySimpleLayout";



export type { EasyProLayoutProps, UpdateTreeNodeParams, EasyRoute, EasyProTableProps,
    EditProps, EasyAsyncSelectProps };

//aim: app can import any one from "easyAntdPro"
export {
    EasyProConfig, EasyProLayout,  EasyProTable,
    EasySchemaFormEditor, saveOne, deleteOne,
    asyncSelectProps2Request, asyncSelect2Request, routesToMenu, EasySimpleLayout
};


