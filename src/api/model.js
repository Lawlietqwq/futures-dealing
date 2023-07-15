import store from '@/store'
import httpRequest from '@/utils/request'

export async function getAllModel(){
    return await httpRequest.get(`/model`, null)
}

export async function getAllModelByUid(){
    return await httpRequest.get(`/model/user/${store.getters.uid}`, null)
}


export async function getModelById(modelId){
    return await httpRequest.get(`/model/${modelId}`, null)
}


export async function createModel(data){
    return await httpRequest.post('/model', data)
}

export async function createBatchModel(data){
    return await httpRequest.post('/model/batch', data)
}


export async function updateModel(data){
    return await httpRequest.put(`/model`, data)
}


export async function deleteModel(modelId){
    return await httpRequest.delete(`/model/${modelId}`, null)
}

export async function startModel(tradingVO){
    return await httpRequest.put('/model/start', tradingVO)
}

export async function pauseModel(modelVO){
    return await httpRequest.putParams('/model/pause', modelVO)
}

export async function forceCloseModel(tradingVO){
    return await httpRequest.put('/model/force', tradingVO)
}

export async function changeCloseModel(newCloseStrategyVO){
    return await httpRequest.post('/model/change', newCloseStrategyVO)
}


