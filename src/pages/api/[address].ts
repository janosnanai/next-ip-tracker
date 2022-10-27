import type { NextApiRequest, NextApiResponse } from "next";

import dns from "dns/promises";

import validateAddress, { AddressTypes } from "../../utils/validateAddress";

const API_KEY = process.env.IPGEOLOCATION_API_KEY as string;
const BASE_URL = "https://api.ipgeolocation.io/ipgeo";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let resolvedAddresses: string[] = [];
  let address = req.query.address as string;

  const validationResult = validateAddress(address as string);

  if (!validationResult.isValid) {
    res.status(400).json({ message: "Bad request" });
    return;
  }

  // if it's url it needs resolving
  if (validationResult.type === AddressTypes.DOMAIN) {
    try {
      resolvedAddresses = await dns.resolve(address);
    } catch (err: any) {
      res.status(err.code === "ENOTFOUND" ? 404 : 500).json({
        message:
          err.code === "ENOTFOUND" ? "Not found" : "Something went wrong",
      });
      return;
    }

    if (!resolvedAddresses || !resolvedAddresses.length) {
      res.status(404).json({ message: "Not found" });
      return;
    }

    address = resolvedAddresses[0];
  }

  try {
    const response = await fetch(`${BASE_URL}?apiKey=${API_KEY}&ip=${address}`);
    const data: IpGeoResponseData = await response.json();
    if (!response.ok) throw new Error("Something went wrong");
    res.status(200).json(data);
    return;
  } catch (err: any) {
    res.status(err.code === "ENOTFOUND" ? 404 : 500).json({
      message: err.code === "ENOTFOUND" ? "Not found" : "Something went wrong",
    });
    return;
  }
}
