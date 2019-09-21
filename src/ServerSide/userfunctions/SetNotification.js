import generateId from '../generate';

const setNotifications = (contenttype , uid , displayname , groupname, groupid ,input , name , type , groupapi) => {

    let message; let extracomment;
    if (contenttype === "commentonpost") {
        message = displayname + ' posted a comment in ' + groupname
        extracomment = displayname + ': ' + input
    } else if (contenttype === "createpostquestion") {
        message = displayname + ' posted a question in ' + groupname
        extracomment = input
    } else if (contenttype === "createpoststatement") {
        message = displayname + ' posted a statement in ' + groupname
        extracomment = input
    } else if (contenttype === "createfolder") {
        message = displayname + ' made a folder named ' + input + ' in ' + groupname
    } else if (contenttype === "addfiletofolder") {
        message = displayname + 'added a file in' + name 
    } else if (contenttype === "commentonfile") {
        message = displayname + ' commented on ' + name
        extracomment = displayname + ": " + input
    }

    const data = {
        creator: uid,
        displayname: displayname,
        groupname: groupname,
        displaycomment: message,
        commentpost: input,
        extracomment: extracomment,
        date: new Date(),
        notificationid: generateId(50),
        contentype: contenttype,
        type: type,
        groupapi: groupapi
    }
   

    fetch('/api/group/getgroupusers/' + groupid)
    .then((res) => {
        return res.json();
    }).then((bod) => {
        const currentuid = bod.users.indexOf(data.creator);
        bod.users.splice(currentuid, 1);
        console.log(bod);
        bod.users.forEach((item) => {
            fetch(`/user/setnotification/${item}` , {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }).then(() => {
                console.log('worked')
            }).catch((error) => {
                console.log(error);
            })
        })
    }).catch((error) => {
        console.log(error);
    })
}

export default setNotifications;

