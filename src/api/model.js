import httpRequest from '@/utils/request'

export async function getAllModel(){
    return await httpRequest.get('/model', null)
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