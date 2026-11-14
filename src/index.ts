import { EasyProConfig } from "./EasyProConfig";
import  {EasyProLayout, type EasyProLayoutProps } from "./EasyProLayout";
import { type EasyRoute } from "./EasyProRoute";
import { EasyProTable, EasySchemaFormEditor, type UpdateTreeNodeParams, delOne, saveOne } from "./EasyProTable";
import { type EasyAsyncSelectProps, type EasyProTableProps, type EditProps, asyncSelect2Request, asyncSelectProps2Request } from "./EasyProTableProps";
import { EasySimpleLayout, routesToMenu } from "./EasySimpleLayout";
import { AntdAppBridge, setAntdAppInstance, getAntdAppInstance, message, modal, notification, getMessage, showError } from "./antdApp";



export type { EasyProLayoutProps, UpdateTreeNodeParams, EasyRoute, EasyProTableProps,
    EditProps, EasyAsyncSelectProps };

//aim: app can import any one from "easyAntdPro"
export {
    EasyProConfig, EasyProLayout,  EasyProTable,
    EasySchemaFormEditor, saveOne, delOne,
    asyncSelectProps2Request, asyncSelect2Request, routesToMenu, EasySimpleLayout,
    AntdAppBridge, setAntdAppInstance, getAntdAppInstance,
    message, modal, notification, getMessage, showError
};


