export async function GET() {
  return Response.json({
    source: "sapiomatch-next-directory",
    countries: {
      uae: {
        universities: [
          { name: "American University of Sharjah", slug: "american-university-of-sharjah", type: "University", location: "Sharjah, UAE" },
          { name: "University of Birmingham Dubai", slug: "university-of-birmingham-dubai", type: "University", location: "Dubai Academic City" },
          { name: "Middlesex University Dubai", slug: "middlesex-university-dubai", type: "University", location: "Dubai Knowledge Park" }
        ]
      },
      uk: {
        universities: [
          { name: "University of Birmingham", slug: "university-of-birmingham", type: "University", location: "Birmingham, UK" },
          { name: "De Montfort University", slug: "de-montfort-university", type: "University", location: "Leicester, UK" },
          { name: "London Business School", slug: "london-business-school", type: "University", location: "London, UK" }
        ]
      },
      usa: {
        universities: [
          { name: "Hult International Business School", slug: "hult-international-business-school", type: "University", location: "Boston / San Francisco" },
          { name: "Rochester Institute of Technology", slug: "rochester-institute-of-technology", type: "University", location: "New York, USA" }
        ]
      },
      canada: {
        universities: [
          { name: "University of British Columbia", slug: "university-of-british-columbia", type: "University", location: "Vancouver, Canada" },
          { name: "McGill University", slug: "mcgill-university", type: "University", location: "Montreal, Canada" }
        ]
      },
      australia: {
        universities: [
          { name: "University of Melbourne", slug: "university-of-melbourne", type: "University", location: "Melbourne, Australia" },
          { name: "Australian National University", slug: "australian-national-university", type: "University", location: "Canberra, Australia" }
        ]
      }
    }
  });
}
