import { END_POINT } from "../utils/constants";
import Api from "./baseApi";

export default {
  // Upload the raw .xlsx as multipart. Unlike the family import (which sends
  // browser-parsed rows), the guest import needs the actual file: the groups are
  // defined by cell borders, which the client's xlsx build can't read — so the
  // server parses it with ExcelJS. Let axios set the multipart boundary; don't
  // override Content-Type.
  importGuests(token, vacationId, file) {
    const form = new FormData();
    form.append("file", file);
    return Api.post(`${END_POINT.GUEST_IMPORT}/${vacationId}`, form, {
      headers: { Authorization: token },
    });
  },
};
