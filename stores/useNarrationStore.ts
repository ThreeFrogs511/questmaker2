import { create } from 'zustand'
import { Nodes } from '@/types/types'

type useNarrationStore = {
    currentCampaign: Nodes | undefined
    setCurrentCampaign: (currentCampaign: Nodes) => void
    campaignTitle: string | undefined
    setCampaignTitle: (campaignTitle: string) => void
    currentNode: keyof Nodes | undefined
    updateNode: (currentNode: keyof Nodes | undefined) => void
    ost: (() => void) | undefined,
    resetAll: () => void

}


export const useNarrationStore = create<useNarrationStore>((set, get, store) => ({
    currentCampaign: undefined,
    setCurrentCampaign : (nodes) => set(({currentCampaign:nodes})),
    campaignTitle : undefined,
    setCampaignTitle: (title) => set(({campaignTitle:title})),
    currentNode:undefined,
    updateNode: (node) => set(({ currentNode : node})),   
    ost: undefined,
    resetAll: () => {
        set(store.getInitialState())
    }
    

}))
