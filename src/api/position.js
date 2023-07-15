import store from '@/store'
import httpRequest from '@/utils/request'

export async function getAllHoldingByUid(){
    const uid = store.getters.uid;
    return await httpRequest.get('/position/uid', {uid:uid})
}

export async function getAllHoldingByModelId(modelId){
    return await httpRequest.get('/position/model', {modelId:modelId})
}

export async function getAllHoldingByCode(code){
    return await httpRequest.get('/position/code', {code:code})
}

export async function getOpenNumByModelId(modelId){
  return await httpRequest.get(`/position/${modelId}`,null)
}

