import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import {
    PageContainer,
    ProLayout, ProConfigProvider,
    type ProLayoutProps
} from '@ant-design/pro-components';


export interface EasyProLayoutProps extends ProLayoutProps{
    dark?: boolean
}

export const EasyProLayout = (props: EasyProLayoutProps) => {

    const [pathname, setPathname] = useState('/');
    //const [sideBarCollapsed, setSideBarCollapsed] = useState(true)

    if (typeof document === 'undefined') {
        return <div />;
    }
    return (
        <ProConfigProvider dark={props.dark}>
            <ProLayout
                {...props}
                location={{ pathname }}
                menuItemRender={(menuItemProps, defaultDom) => {
                    if (menuItemProps.isUrl || !menuItemProps.path) {
                        return defaultDom;
                    }
                    return <div onClick={() => { 
                        setPathname(menuItemProps.path || '/') 
                        //console.log("menu clicked: "+menuItemProps.path)
                        }}>
                        <Link to={menuItemProps.path} target={menuItemProps.target}>{defaultDom}</Link>
                    </div>
                }}
            >
                <PageContainer
                    style={{
                        height: '200vh',
                        minHeight: 800,
                    }}
                >
                    <Outlet />
                </PageContainer>

            </ProLayout>
        </ProConfigProvider>

    );
};
