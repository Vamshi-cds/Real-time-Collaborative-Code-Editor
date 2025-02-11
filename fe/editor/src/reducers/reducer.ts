

const rootReducer = (state:any, action:any)=>{
    // whenever dispatcher is called, then this method is called and choose appropriate dispatch action and change global states
        if (action.type === "Login"){
            var user_name = action.username
            return {
                ...state,
                username: user_name
            };
        }
        else if (action.type === "Doc"){
            var docid = action.docid
            return {
                ...state,
                docid: docid
            };
        }
        else if (action.type === "Title"){
            var doctitle = action.doctitle
            return {
                ...state,
                doctitle: doctitle
            };
        }
        // if (action.type === "DELETE_POST") {
        //     // creating list of new posts
        //     let newPosts = state.posts.filter(post => {
        //       return action.id !== post.id;
        //     });
        //     // only updating the posts property and other properties will be reamined same
        //     //...state will copy all the properties of current state object to here and posts property is overridden here (posts came from ...state is overridden by posts defined below it)
        //     return {
        //       ...state,
        //       posts: newPosts
        //     };
        //   }
    // return updated state
    return state;
    };
    
    
    export default rootReducer;