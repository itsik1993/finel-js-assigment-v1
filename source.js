// url
const  categories_url = "api/categories.json";
const jobs_url = "api/remote-jobs.json";
const baseurl ="api/byCategories/"
const serchCategory ="https://remotive.com/api/remote-jobs?category="
//page
let pages="";

//catches
const categoriList=document.querySelector("#categoriList")
const mainJobs=document.querySelector("#mainJobs")
const searchBtn=document.querySelector("#searchBtn")
let searchInput=document.querySelector("#searchInput")
let alljobs=document.querySelector("#alljobs")
let homePagetag=document.querySelector("#homePage")
let categorisicon=document.querySelector("#categorisicon")
let savedjobs=document.querySelector("#savedjobs")


// var
let categoriArry=[];
let AllJobsArry=[];
let searchARRY=[];
let categoryjobs=[]
let favoritJobs=JSON.parse(localStorage.getItem("favoritJObsSaves")) || [];
let ArryOfAllJobs = ne


async function getCategories(){
    try {
      const response = await fetch(`${categories_url}`);
      const data = await response.json();
      categoriArry=data.jobs

      // console.log(categoriArry)
    } catch (error) {
        console.log(error);
    }

    BuildCategoryNav(categoriArry)

} 


 async function getAllJobs(){
mainJobs.innerHTML=`
<div class="d-flex justify-content-center">
  <div class="spinner-border" role="status">
    <span class="visually-hidden">Loading...</span>
  </div>
</div>
`
  try {
    const response = await fetch(jobs_url);
    const data = await response.json();
    AllJobsArry=data.jobs
    
  } catch (error) {
    console.log(error)
    
  }

  BuildJobs(AllJobsArry)

}



async function getSearch(categoryname=searchInput.value){
  mainJobs.innerHTML=`
  <div class="d-flex justify-content-center">
    <div class="spinner-border" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
  `
  
  try {
    const response= await fetch(`${baseurl}${categoryname}`)
    const data= await response.json()
    // console.log(data.jobs)
    searchArry=data.jobs
  

    BuildJobs(searchArry)
    
  } catch (error) {
    console.log(error)
    mainJobs.innerHTML="no jobs found try again"
    
  }




}






function BuildCategoryNav(categoryArry){
  
  categoryArry.forEach((cate,i)=>{
    // console.log(cate.slug)
    categoriList.innerHTML+=`
   <li  id="categoryNum${i}"><a onclick="BuildjobsByCategory('${cate.slug}')" class="dropdown-item" href="#">${cate.name}</a></li>
     
    `  
  })
  

}




async function BuildjobsByCategory(categoryvalue){
// יש כאן באג עיקרי כי אנחנו מגבילים את החיפוש , ולכן לא תמיד תהיה התאמה בגלל שאני רץ בALL JOBS על המערך ולא מעביר את האובייקט
mainJobs.innerHTML=`
<div class="d-flex justify-content-center">
  <div class="spinner-border" role="status">
    <span class="visually-hidden">Loading...</span>
  </div>
</div>
`
  try {
    // הערה- פה זה חיפוש לפי בחירת התבנית של הקטגוריה ולא חיפוש חופשי ולכן צריך לחבר API אמיתי
       const response = await fetch(`https://remotive.com/api/remote-jobs?category=${categoryvalue}&limit=10`)
       const data= await response.json();
       categoryjobs=data.jobs

       
       BuildJobs(categoryjobs)


  } catch (error) {
    console.log(error)
    
  }
}

function BuildJobs(jobArry){
if(pages==="SavedJobs")
{
  jobArry=favoritJobs;
  if(favoritJobs.length<1){
    mainJobs.innerHTML=`<h1>Favorite list is empty</h1>`
    return;
  }
}
  else if(pages==="search")
    jobArry=searchArry;
  else if(pages==="category")
    jobArry=categoryjobs
else if(pages==="SavedJobs")
  jobArry=favoritJobs;
else if(pages==="AllJobs")
  jobArry=AllJobsArry;

  mainJobs.innerHTML="";
  
  jobArry.forEach((job,i)=>{
    const isFavorite = favoritJobs.some((jobsId) => jobsId.id === job.id);

    const eventName = isFavorite ? "Removefavorite" : "SaveToFavorit";

    mainJobs.innerHTML+=`
      <div class="card text-center w-25" id="responcivDiv">
          <div class="card-header" id="cardHead">
            company name:${job.company_name}
          </div>
          <div id="joblogo">
            <img src="${job.company_logo}" alt="logo" height="50px" width="50px">
          </div>
          <div class="card-body ">
            <h5 class="card-title">${job.title} </h5>
      
            <div id="details">
              <span> salery: ${job.salary} </span>
            </div>
        
            <div class="w-100 overflow-auto"  style="height: 270PX;">
              <p class="card-text" id="textroll">${job.description}</p>

            </div>
          
         
          </div>
            <div id="btnLinks">
            <button  class="${isFavorite ? "btn btn-danger " : "btn btn-primary saveBTN"} " id="saveBTN" onclick="${eventName}(${job.id})">${isFavorite ? "Delete Favorit 💔 " : "Save To Favorit ❤️"}</button>
              <a href="${job.url}" target="_blank" class="btn btn-primary" id="LinkBtn">see this Job 🔍</a>
            </div>
          <div class="card-footer text-body-secondary">
            type:${job.job_type}
          </div>
        </div>
    
    `
  })
}



function homePage(){

  mainJobs.innerHTML="";
  mainJobs.innerHTML=`
 <div id="headlines">
    <h1> welcome to our job search service</h1>
    <h5 class="mt-5"> here you can finde all jobs</h5>
    <hr>
    <h3> we are here for you, enjoy</h3>
   </div>

  `

}







function SaveToFavorit(jobId){
  // alert("work")
  // const currentJob=JSON.parse(decodeURIComponent(j))
  AllJobsArry.forEach((jobElment)=>{

    if(jobElment.id===jobId)
      favoritJobs.push(jobElment);
    localStorage.setItem("favoritJObsSaves",JSON.stringify(favoritJobs))
  })
  
  console.log(favoritJobs)
  BuildJobs()

}

function Removefavorite(jobId){

  // const currentFavoritJob=JSON.parse(decodeURIComponent(j))
  AllJobsArry.forEach((jobElment)=>{

    if(jobElment.id===jobId)
    {
      const index = favoritJobs.findIndex((work) => work.id === jobId);
      favoritJobs.splice(index, 1);
    localStorage.setItem("favoritJObsSaves",JSON.stringify(favoritJobs))

    }
  })
 
  // console.log(favoritJobs)
  BuildJobs()

}








getCategories();
// getAllJobs()
homePage();




searchBtn.addEventListener("click",(e)=>{
  e.preventDefault()
  homePagetag.classList.add('fw-lighter')
  alljobs.classList.add('fw-lighter')
  savedjobs.classList.add('fw-lighter')
  categorisicon.classList.add('fw-lighter')
  pages="search"
  getSearch();

})

alljobs.addEventListener("click",()=>{
  homePagetag.classList.add('fw-lighter')
  alljobs.classList.remove('fw-lighter')
  categorisicon.classList.add('fw-lighter')
  savedjobs.classList.add('fw-lighter')
  pages="AllJobs"
  searchInput.value="";
  getAllJobs(AllJobsArry)
})
homePagetag.addEventListener("click",()=>{
  alljobs.classList.add('fw-lighter')
  homePagetag.classList.remove('fw-lighter')
  categorisicon.classList.add('fw-lighter')
  savedjobs.classList.add('fw-lighter')
  pages="AllJobs";
  searchInput.value="";

  homePage()
})

categorisicon.addEventListener("click",()=>{
  categorisicon.classList.remove('fw-lighter')
  homePagetag.classList.add('fw-lighter')
  alljobs.classList.add('fw-lighter')
  savedjobs.classList.add('fw-lighter')
  pages="category";
  searchInput.value="";


})

savedjobs.addEventListener("click",()=>{
  savedjobs.classList.remove('fw-lighter')
  homePagetag.classList.add('fw-lighter')
  alljobs.classList.add('fw-lighter')
  categorisicon.classList.add('fw-lighter')
  pages="SavedJobs"
  searchInput.value="";


  if(favoritJobs.length<1) {
   mainJobs.innerHTML=`<h1>Favorite list is empty</h1>`
  } 
  else {
    BuildJobs(favoritJobs)
  }

})



