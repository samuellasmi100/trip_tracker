import React, { useEffect, useState } from "react";
import RegionSelectView from "./RegionSelect.view";
import { useDispatch, useSelector } from "react-redux";
import * as regionSlice from "../../../store/slice/regionSlice";
import ApiClient from "../../../apis/clientRequest";

function RegionSelect(props) {
  const dispatch = useDispatch();
  const token = sessionStorage.getItem("token");
  const { regions } = useSelector((state) => state.regionSlice);
  const [selectedRegions, setSelectedRegions] = useState([]);
  const { viewAsClientUser } = useSelector((state) => state.impersonationSlice);

  const handleRegionSelect = async (event) => {
    const { value } = event.target;   
  
    setSelectedRegions(value);
    let updatedRegions = dispatch(regionSlice.updateSubscription(value)).filter(
      (region) => {
        return region.subscribed === 1;
      }
    );
    try {
      if (viewAsClientUser) {
        let viewAsClientUserObject = {
          clientUserTableId: viewAsClientUser.clientUserId,
          userId: viewAsClientUser.clientUserIdTable,
        };
       const response =  await ApiClient.updateClientUserRegions(
          token,
          updatedRegions,
          viewAsClientUserObject
        );
      } else {
        const response = await ApiClient.updateClientUserRegions(token, updatedRegions);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    let subscribedRegion = regions
      .filter((item) => item.subscribed === 1)
      .map((item) => item.region_name);
    setSelectedRegions(subscribedRegion);
  }, [regions]);

  return (
    <RegionSelectView
      regionMainClass={props.regionMainClass}
      setSelectedRegions={setSelectedRegions}
      selectedRegions={selectedRegions}
      handleRegionSelect={handleRegionSelect}
      formControlWidth={props.formControlWidth}
    />
  );
}

export default RegionSelect;
