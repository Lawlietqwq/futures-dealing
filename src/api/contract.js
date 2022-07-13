import httpRequest from '@/utils/request'

export async function getAllContractCode(){
    return await httpRequest.get('/contract/code', null)
}

export async function getAllContractDetail(){
  return await httpRequest.get('/contract', null)
}

export async function getContractDetailByCode(code){
  return await httpRequest.get(`/contract/${code}`, null)
}
