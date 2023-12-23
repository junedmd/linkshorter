import React, { useState ,useEffect} from "react"
import "./App.css"
import axios from "axios"
export default function App(){

  const [url, setUrl] = useState('')
  const [slug, setSlug] = useState('')
  const [newurl, setNewurl] = useState('')
  const [newlinks, setNewLinks] = useState([])
  const generateLink = async () => {
    try {
      const response = await axios.post('/links', {
        url: url,
        slug: slug
      })
      setNewurl(response?.data?.Link.link)
    }
    catch (error) {
      console.log(error)
    }
    loadlinks();
  }
  const loadlinks = async () => {
    const response = await axios.get('/api/links')
    setNewLinks(response?.data?.data)
  }
  useEffect(() => {
    loadlinks();
  }, [])


 return(
   <>
   <h1 className="text1 text2"> Link Shorter</h1>

     <div className=" main-container ">

       <div className="link-generater">
           <h2 className="text1"> Link Generation </h2>
           <input type="text" placeholder="URL"
            className="url-input"
            value={url}
            onChange={(e)=>{setUrl(e.target.value)}}
            /><br></br>

           <input type="text" placeholder="SLUG (optional)"
            className="url-input"
            value={slug}
            onChange={(e)=>{setSlug(e.target.value)}}
            /><br/>

            <input  type="text" placeholder="ShortUrl" 
             className="url-input"
            value={newurl}
            disabled
            />

            <button type="button" className="btn"
            onClick={generateLink}
            >
              Generate Url</button>
       </div>

       <div className="all-link">
         
         {
          newlinks?.map((linkobj ,index)=>{
               const {url,slug ,clicks}=linkobj;
               return(
                 <div className="link-contain">
                   <p>URL: {url}</p>
                   <p> ShortLink:{process.env.REACT_APP_URL}/{slug}</p>
                   <p> Clicks :{clicks}</p>
                 </div>

               )
           })
         }
       </div>
     </div>
   </>
 )
}