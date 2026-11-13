import { App as AntdApp, message as staticMessage, Modal as staticModal, notification as staticNotification } from 'antd';
import { toErrMsg } from '@rwsbillyang/usecache';

export type AntdAppInstance = ReturnType<typeof AntdApp.useApp>;

// Holds the antd App context instances (message/modal/notification) captured
// from App.useApp(). Plain helper functions such as saveOne/deleteOne cannot call
// hooks, so they read the instance from here instead of using antd's static
// functions (which warn "Static function can not consume context" in antd v6).
let instance: AntdAppInstance | null = null;

export function setAntdAppInstance(i: AntdAppInstance): void {
  instance = i;
}

export function getAntdAppInstance(): AntdAppInstance | null {
  return instance;
}

/**
 * Render this component inside an antd <App> to capture the contextual
 * message/modal/notification instances into the module-level holder.
 * The library layouts already render it, so no app-side wiring is required
 * when the layouts are used. For apps that do not use the layouts, render
 * <AntdAppBridge /> once under their own <App>.
 */
export function AntdAppBridge(): null {
  setAntdAppInstance(AntdApp.useApp());
  return null;
}

// Facade objects that delegate to the contextual antd App instances when
// available (so they consume dynamic theme/locale and do not warn), and fall
// back to antd's static methods otherwise. Apps can import { message } from
// 'easy-antd-pro' instead of from 'antd' to silence the static-function warning
// without touching every call site.
const getMsg = (): any => getAntdAppInstance()?.message ?? staticMessage;
const getMdl = (): any => getAntdAppInstance()?.modal ?? staticModal;
const getNtf = (): any => getAntdAppInstance()?.notification ?? staticNotification;

// 与 getMsg 等价，作为统一的错误上报入口（getMessage().error(...)）。
export const getMessage = getMsg;

// 统一的错误上报入口：通过 antd App 上下文的 message.error 提示错误。
export function showError(e: unknown, fallback?: string): void {
  getMessage().error(toErrMsg(e, fallback));
}

export const message = {
  success: (...a: any[]) => (getMsg() as any).success(...a),
  error: (...a: any[]) => (getMsg() as any).error(...a),
  info: (...a: any[]) => (getMsg() as any).info(...a),
  warning: (...a: any[]) => (getMsg() as any).warning(...a),
  loading: (...a: any[]) => (getMsg() as any).loading(...a),
  open: (...a: any[]) => (getMsg() as any).open(...a),
  destroy: (...a: any[]) => (getMsg() as any).destroy(...a),
} as any;

export const modal = {
  confirm: (...a: any[]) => (getMdl() as any).confirm(...a),
  info: (...a: any[]) => (getMdl() as any).info(...a),
  success: (...a: any[]) => (getMdl() as any).success(...a),
  error: (...a: any[]) => (getMdl() as any).error(...a),
  warning: (...a: any[]) => (getMdl() as any).warning(...a),
} as any;

export const notification = {
  success: (...a: any[]) => (getNtf() as any).success(...a),
  error: (...a: any[]) => (getNtf() as any).error(...a),
  info: (...a: any[]) => (getNtf() as any).info(...a),
  warning: (...a: any[]) => (getNtf() as any).warning(...a),
  open: (...a: any[]) => (getNtf() as any).open(...a),
  destroy: (...a: any[]) => (getNtf() as any).destroy(...a),
} as any;
