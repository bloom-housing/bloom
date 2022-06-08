export enum Region {
  GreaterDowntown = "Greater Downtown",
  Eastside = "Eastside",
  Southwest = "Southwest",
  Westside = "Westside",
}

// TODO(#674): Get official hosted images
export const regionImageUrls: Map<Region, string> = new Map([
  [Region.GreaterDowntown, "https://pbs.twimg.com/media/DSzZwQKVAAASkw_?format=jpg&name=large"],
  [
    Region.Eastside,
    "https://d12kp1agyyb87s.cloudfront.net/wp-content/uploads/2019/10/image001.jpg",
  ],
  [
    Region.Southwest,
    "https://www.theneighborhoods.org/sites/the-neighborhoods/files/2020-10/Southwest-Mural_1.jpg",
  ],
  [
    Region.Westside,
    "https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Atkinson_avenue_historic_district.JPG/1920px-Atkinson_avenue_historic_district.JPG",
  ],
])

export interface Neighborhood {
  name: string
  region: Region
}

export const neighborhoodRegions: Neighborhood[] = [
  { name: "Airport Sub area", region: Region.Eastside },
  { name: "Barton McFarland area", region: Region.Westside },
  { name: "Boston-Edison / North End area", region: Region.Westside },
  { name: "Boynton", region: Region.Southwest },
  { name: "Campau / Banglatown", region: Region.Eastside },
  { name: "Dexter Linwood", region: Region.Westside },
  { name: "Farwell area", region: Region.Eastside },
  { name: "Gratiot Town / Kettering area", region: Region.Eastside },
  { name: "Gratiot / 7 Mile area", region: Region.Eastside },
  { name: "Greater Corktown area", region: Region.GreaterDowntown },
  { name: "Greater Downtown area", region: Region.GreaterDowntown },
  { name: "Islandview / Greater Villages area", region: Region.Eastside },
  { name: "Jefferson Chalmers area", region: Region.Eastside },
  { name: "Livernois / McNichols area", region: Region.Westside },
  { name: "Morningside area", region: Region.Eastside },
  { name: "North Campau area", region: Region.Eastside },
  { name: "Northwest Grand River area", region: Region.Westside },
  { name: "Northwest University District area", region: Region.Westside },
  { name: "Palmer Park area", region: Region.Westside },
  { name: "Russell Woods / Nardin Park area", region: Region.Westside },
  { name: "Southwest / Vernor area", region: Region.Southwest },
  { name: "Warrendale / Cody Rouge", region: Region.Westside },
  { name: "West End area", region: Region.Eastside },
]
