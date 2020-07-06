const request = require("request-promise")
const cheerio = require("cheerio")
const fs = require("fs")
const json2csv = require("json2csv").Parser;


const movies = ["https://m.imdb.com/title/tt0242519/?ref_=nv_sr_srsg_6", "https://m.imdb.com/title/tt12448030/?pf_rd_m=A2FGELUUNOQJNL&pf_rd_p=bc7330fc-dcea-4771-9ac8-70734a4f068f&pf_rd_r=NSF19874XVA8S6B4BN73&pf_rd_s=center-8&pf_rd_t=15021&pf_rd_i=tt0242519&ref_=m_tt_tp_i_3","https://m.imdb.com/title/tt10530392/?pf_rd_m=A2FGELUUNOQJNL&pf_rd_p=bc7330fc-dcea-4771-9ac8-70734a4f068f&pf_rd_r=MWRKFZ76TQEHXHMX4K0Z&pf_rd_s=center-8&pf_rd_t=15021&pf_rd_i=tt12448030&ref_=m_tt_tp_i_2"];

( async() => {
    let imdbData = [];
    for(let movie of movies){
    const response = await request({
        uri : movie,
        headers : {
            accept: "application/json, text/plain, */*",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "en-US,en;q=0.9,hi;q=0.8,th;q=0.7"
        },
        gzip : true
    })

    let $ = cheerio.load(response)
    let title =  $('div[class="title_wrapper"] > h1').text().trim()
    let rating =  $('div[class = "ratingValue"] > strong > span').text() 
    let summary = $('div[class = "summary_text"]').text().trim()
    let releaseDate =   $('a[title = "See more release dates"]').text().trim()
    imdbData.push({
        title,
        rating,
        summary,
        releaseDate
    });
}
    const j2cp = new json2csv() 
    const csv = j2cp.parse(imdbData)

    fs.writeFileSync("./imdb.csv", csv, "utf-8")

})();

