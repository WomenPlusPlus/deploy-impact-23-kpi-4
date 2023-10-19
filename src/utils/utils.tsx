import type { MenuProps } from 'antd'
import { roles } from '../types/types'

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
export const isGatekeeper = (role: string | undefined) => role === roles.GATEKEEPER

export const isEconomist = (role: string | undefined) => role === roles.ECONOMIST