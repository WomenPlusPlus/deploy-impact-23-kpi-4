import type { MenuProps } from 'antd'

type MenuItem = Required<MenuProps>['items'][number];

export const getMenuItems = (
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  onClick? :() => void,
  children?: MenuItem[],
): MenuItem => {
  return {
    key,
    icon,
    children,
    label,
    onClick
  } as MenuItem
}
