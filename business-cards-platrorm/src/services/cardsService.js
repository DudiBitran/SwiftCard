import httpService from "./httpService";

function getAllCards() {
  return httpService.get("/cards");
}

function likeAndUnlike(id) {
  return httpService.patch(`/cards/${id}`);
}

function getMyCards() {
  return httpService.get(`/cards/my-cards/`);
}

function getCardById(id) {
  return httpService.get(`/cards/${id}`);
}

function deleteCard(id) {
  return httpService.delete(`/cards/${id}`);
}

function createCard(details) {
  return httpService.post("/cards", details);
}

function updateCard(details, id) {
  return httpService.put(`/cards/${id}`, details);
}

function bizNumberUpdate(details, id) {
  return httpService.patch(`/cards/biz-number/${id}`, details);
}

const cardServices = {
  getAllCards,
  likeAndUnlike,
  getMyCards,
  deleteCard,
  getCardById,
  createCard,
  updateCard,
  bizNumberUpdate,
};

export default cardServices;
