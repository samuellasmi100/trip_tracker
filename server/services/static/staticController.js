const router = require("express").Router();
const staticService = require("./staticService")

const LIMIT = 50;

const parsePageParams = (query) => ({
  search: query.search || '',
  limit:  Math.min(parseInt(query.limit)  || LIMIT, 200),
  offset: Math.max(parseInt(query.offset) || 0,     0),
});

router.get("/user/main/:vacationId", async (req, res, next) => {
  const { vacationId } = req.params;
  const { search, limit, offset } = parsePageParams(req.query);
  try {
    const data = await staticService.getMainGuests(vacationId, search, limit, offset)
    res.send({ data: data || [], hasMore: (data || []).length === limit })
  } catch (error) {
    return next(error);
  }
});

router.get("/user/:vacationId", async (req, res, next) => {
  const { vacationId } = req.params;
  const { search, limit, offset } = parsePageParams(req.query);
  try {
    const data = await staticService.getAllGuests(vacationId, search, limit, offset)
    res.send({ data: data || [], hasMore: (data || []).length === limit })
  } catch (error) {
    return next(error);
  }
});

router.get("/flights/:vacationId", async (req, res, next) => {
  const vacationId = req.params.vacationId
  try {
    const response = await staticService.getFlightsDetails(vacationId)
    res.send(response)
  } catch (error) {
    return next(error);
  }
});

router.get("/vacation/:vacationId", async (req, res, next) => {
  const { vacationId } = req.params;
  const { search, limit, offset } = parsePageParams(req.query);
  try {
    const data = await staticService.getVacationDetails(vacationId, search, limit, offset)
    res.send({ data: data || [], hasMore: (data || []).length === limit })
  } catch (error) {
    return next(error);
  }
});

router.get("/payments/:vacationId", async (req, res, next) => {
  const vacationId = req.params.vacationId
  try {
    const response = await staticService.getPaymentsDetails(vacationId)
    res.send(response)
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
