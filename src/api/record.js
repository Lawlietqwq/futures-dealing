import store from '@/store'
import httpRequest from '@/utils/request'

export async function getAllRecordByUid(isHolding){
    const uid = store.getters.uid;
    return await httpRequest.get('/record/uid', {uid:uid, isHolding:isHolding})
}

export async function getAllRecordByModelId(modelId, isHolding){
    return await httpRequest.get('/record/model', {modelId:modelId, isHolding:isHolding})
}


export async function getAllRecordByCode(code, isHolding){
    return await httpRequest.get('/record/code', {code:code, isHolding:isHolding})
}


export async function deleteByRecordId(recordId){
    return await httpRequest.delete(`/record/${recordId}`, null)
}

