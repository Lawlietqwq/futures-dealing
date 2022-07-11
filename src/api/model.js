import store from '@/store'
import httpRequest from '@/utils/request'

export async function getAllModelByUid(){
    return await httpRequest.get(`/model/user/${store.getters.token}`, null)
}


export async function getModelById(modelId){
    return await httpRequest.get(`/model/${modelId}`, null)
}


export async function createModel(data){
    return await httpRequest.post('/model', data)
}


export async function updateModel(data){
    const modelId = data.modelId
    return await httpRequest.put(`/model`, data)
}


export async function deleteModel(modelId){
    return await httpRequest.delete(`/model/${modelId}`, null)
}