import { EasyProConfig } from "./EasyProConfig";
import  {EasyProLayout, type EasyProLayoutProps } from "./EasyProLayout";
import { type EasyRoute } from "./EasyProRoute";
import { EasyProTable, EasySchemaFormEditor, type UpdateTreeNodeParams, deleteOne, saveOne } from "./EasyProTable";
import { type EasyAsyncSelectProps, type EasyProTableProps, type EditProps, asyncSelect2Request, asyncSelectProps2Request } from "./EasyProTableProps";
import { EasySimpleLayout, routesToMenu } from "./EasySimpleLayout";



export type { EasyProLayoutProps, UpdateTreeNodeParams, EasyRoute, EasyProTableProps,
    EditProps, EasyAsyncSelectProps };

//aim: app can import any one from "easyAntdPro"
export {
    EasyProConfig, EasyProLayout,  EasyProTable,
    EasySchemaFormEditor, saveOne, deleteOne,
    asyncSelectProps2Request, asyncSelect2Request, routesToMenu, EasySimpleLayout
};


