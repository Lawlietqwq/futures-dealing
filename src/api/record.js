import store from '@/store'
import httpRequest from '@/utils/request'

export async function getAllRecordByUid(){
    const uid = store.getters.uid;
    return await httpRequest.get('/record/uid', {uid:uid})
}

export async function getAllRecordByModelId(modelId){
    return await httpRequest.get('/record/model', {modelId:modelId})
}


export async function getAllRecordByCode(code){
    return await httpRequest.get('/record/code', {code:code})
}


export async function deleteByRecordId(recordId){
    return await httpRequest.delete(`/record/${recordId}`, null)
}

