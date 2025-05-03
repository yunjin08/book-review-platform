import { createGenericStore } from '../lib/zustand'
import { User } from '@/interface'

export const useUserStore = createGenericStore<User>('/account/users', {
    actions: ['fetchAll', 'fetchOne'],
})
