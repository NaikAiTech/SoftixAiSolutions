export type City = { name: string; slug: string; areas?: string[] };
export type ServiceArea = { country: string; countrySlug: string; currency: string; cities: City[] };

function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export const SERVICE_AREAS: ServiceArea[] = [
  {
    country: "USA",
    countrySlug: "usa",
    currency: "USD",
    cities: [
      { name: "New York", slug: slugify("New York"), areas: ["Manhattan","Brooklyn","Queens","Bronx","Staten Island","Long Island City","Williamsburg","Astoria"] },
      { name: "Los Angeles", slug: slugify("Los Angeles"), areas: ["Downtown LA","Hollywood","Beverly Hills","Santa Monica","Venice","West Hollywood","Pasadena","Long Beach"] },
      { name: "Chicago", slug: slugify("Chicago"), areas: ["The Loop","Lincoln Park","Wicker Park","River North","Hyde Park","Lakeview","Logan Square","South Loop"] },
      { name: "Houston", slug: slugify("Houston"), areas: ["Downtown","Midtown","Montrose","The Heights","West University","River Oaks","Medical Center","Sugar Land"] },
      { name: "Phoenix", slug: slugify("Phoenix"), areas: ["Downtown Phoenix","Scottsdale","Tempe","Mesa","Chandler","Gilbert","Glendale","Peoria"] },
    ],
  },
  {
    country: "UK",
    countrySlug: "uk",
    currency: "GBP",
    cities: [
      { name: "London", slug: slugify("London"), areas: ["City of London","Westminster","Camden","Kensington","Chelsea","Islington","Hackney","Canary Wharf"] },
      { name: "Manchester", slug: slugify("Manchester"), areas: ["City Centre","Salford","Didsbury","Chorlton","Deansgate","Ancoats","Northern Quarter","Hulme"] },
      { name: "Birmingham", slug: slugify("Birmingham"), areas: ["City Centre","Edgbaston","Selly Oak","Harborne","Jewellery Quarter","Digbeth","Solihull","Sutton Coldfield"] },
      { name: "Glasgow", slug: slugify("Glasgow"), areas: ["City Centre","West End","Merchant City","Finnieston","Partick","Shawlands","Govan","Giffnock"] },
    ],
  },
  {
    country: "Australia",
    countrySlug: "australia",
    currency: "AUD",
    cities: [
      { name: "Sydney", slug: slugify("Sydney"), areas: ["CBD","Surry Hills","Newtown","Bondi","Manly","Parramatta","Chatswood","Cronulla"] },
      { name: "Melbourne", slug: slugify("Melbourne"), areas: ["CBD","Fitzroy","Carlton","St Kilda","South Yarra","Docklands","Richmond","Brunswick"] },
      { name: "Brisbane", slug: slugify("Brisbane"), areas: ["CBD","South Bank","Fortitude Valley","New Farm","West End","Toowong","Sunnybank","Chermside"] },
      { name: "Perth", slug: slugify("Perth"), areas: ["CBD","Northbridge","Fremantle","Subiaco","Cottesloe","Joondalup","Scarborough","Victoria Park"] },
    ],
  },
  {
    country: "Canada",
    countrySlug: "canada",
    currency: "CAD",
    cities: [
      { name: "Toronto", slug: slugify("Toronto"), areas: ["Downtown","Scarborough","North York","Etobicoke","York","Mississauga","Brampton","Markham"] },
      { name: "Vancouver", slug: slugify("Vancouver"), areas: ["Downtown","Kitsilano","Yaletown","Gastown","Burnaby","Richmond","Surrey","North Vancouver"] },
      { name: "Montreal", slug: slugify("Montreal"), areas: ["Downtown","Plateau-Mont-Royal","Old Montreal","Rosemont","Outremont","Verdun","Laval","Longueuil"] },
      { name: "Calgary", slug: slugify("Calgary"), areas: ["Downtown","Beltline","Kensington","Bridgeland","Inglewood","Mission","Brentwood","Airdrie"] },
    ],
  },
  {
    country: "New Zealand",
    countrySlug: "new-zealand",
    currency: "NZD",
    cities: [
      { name: "Auckland", slug: slugify("Auckland"), areas: ["CBD","Ponsonby","Newmarket","Parnell","Mt Eden","Takapuna","Albany","Manukau"] },
      { name: "Christchurch", slug: slugify("Christchurch"), areas: ["CBD","Riccarton","Addington","Sumner","Papanui","Sydenham","Halswell","New Brighton"] },
      { name: "Wellington", slug: slugify("Wellington"), areas: ["CBD","Te Aro","Thorndon","Karori","Miramar","Kelburn","Newtown","Lower Hutt"] },
      { name: "Hamilton", slug: slugify("Hamilton"), areas: ["CBD","Rototuna","Flagstaff","Hillcrest","Chartwell","Dinsdale","Frankton","Te Rapa"] },
    ],
  },
  {
    country: "Ireland",
    countrySlug: "ireland",
    currency: "EUR",
    cities: [
      { name: "Dublin", slug: slugify("Dublin"), areas: ["City Centre","Ballsbridge","Rathmines","Drumcondra","Clontarf","Blackrock","Tallaght","Blanchardstown"] },
      { name: "Cork", slug: slugify("Cork"), areas: ["City Centre","Douglas","Blackrock","Bishopstown","Ballincollig","Glanmire","Wilton","Carrigaline"] },
      { name: "Galway", slug: slugify("Galway"), areas: ["City Centre","Salthill","Knocknacarra","Oranmore","Tuam Road","Ballybane","Mervue","Athenry"] },
      { name: "Limerick", slug: slugify("Limerick"), areas: ["City Centre","Castletroy","Dooradoyle","Raheen","Corbally","Caherdavin","Annacotty","Patrickswell"] },
    ],
  },
];
