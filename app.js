const meal = document.querySelector(".add-meal")
const calories = document.querySelector(".calories")
let totalCalories = 0
const calorieNumber = document.querySelector(".calorie-number")
let idNum

function Pagestate(){
    this.currentstate = mealstate
}
Pagestate.prototype = {
    change : function(state){
        this.currentstate = state
    },

    init : function(){
        this.change(mealstate)
    }
}
function mealstate(){
    document.querySelector(".add-edit").innerHTML = `<a href="#" class="add-task btn" style="font-weight: bold; background-color: black;">+ Add Meal</a>`
}
function editstate(){
    document.querySelector(".add-edit").innerHTML = `
        <a href="#" class="update btn" style="font-weight: bold; background-color: #f0a110;">Update Meal</a>
        <a href="#" class="delete btn" style="font-weight: bold; background-color: #fd0000;">Delete</a>
        <a href="#" class="back btn secondary-content" style="font-weight: bold; background-color: #443d3d;">Back</a>
    `
}
const page = new Pagestate()
page.currentstate()




const ui = (function(){
    function addCalorie(){
        let arr
        let id
        if(localStorage.getItem("arr") === null){
            arr = [0]
        }
        else{
            arr = JSON.parse(localStorage.getItem("arr"))
        }

        id = arr[arr.length - 1] + 1
        arr.push(id)
        localStorage.setItem("arr", JSON.stringify(arr))

        document.querySelector(".collection").innerHTML += `<li id ="${id}" class="collection-item"><span class = "meal-value">${meal.value}</span> : <span class = "calorie-value">${calories.value}</span><i class="edit-calorie material-icons secondary-content">edit</i></li>`
        totalCalories += Number(calories.value)
        calories.value = ""
        meal.value = ""
        calorieNumber.textContent = totalCalories
    }

    function updateCalorie(num){
        document.querySelector(".collection").innerHTML += `<li id ="${num}" class="collection-item"><span class = "meal-value">${meal.value}</span> : <span class = "calorie-value">${calories.value}</span><i class="edit-calorie material-icons secondary-content">edit</i></li>`
        document.querySelector(".collection").insertBefore(document.getElementById(`${num}`), document.getElementById(`${num + 1}`))
        totalCalories += Number(calories.value)
        calories.value = ""
        meal.value = ""
        calorieNumber.textContent = totalCalories
        page.change(mealstate)
        page.currentstate()
    }

    function deleteCalorie(num){
        let i = 1
        Array.from(document.querySelectorAll(".collection-item")).forEach(item => {
            item.id = i
            i++
        })
        calories.value = ""
        meal.value = ""
        page.change(mealstate)
        page.currentstate()
    }

    function editCalorie(collection){
        page.change(editstate)
        page.currentstate()
        children = Array.from(collection.children)
        meal.value = children[0].textContent
        calories.value = children[1].textContent
        totalCalories -= Number(children[1].textContent)
        calorieNumber.textContent = totalCalories
        collection.remove()
    }

    function clearCalorie(){
        Array.from(document.querySelectorAll(".collection-item")).forEach(item => {
            item.remove()
        })
        calorieNumber.textContent = 0
    }

    return {
        add : function(){
            addCalorie()
        },

        delete : function(item){
            deleteCalorie(item)
        },

        edit : function(target){
            editCalorie(target)
        },

        update: function(item){
            updateCalorie(item)
        },

        clear : function(){
            clearCalorie()
        }
    }
})()

const storage = (function(){
    let listItem
    function persistToLs(item){
        if(localStorage.getItem("listItem") === null){
            listItem = []
        }
        else{
            listItem = JSON.parse(localStorage.getItem("listItem"))
            const id = listItem[listItem.length - 1]
            item.id = id.id + 1
        }

        listItem.push(item)

        localStorage.setItem("listItem", JSON.stringify(listItem))
    }

    function updateLS(num){
        listItem = JSON.parse(localStorage.getItem("listItem"))
        listItem.forEach(obj => {
            if(obj["id"] === num){
                obj["meal"] = meal.value
                obj["calorie"] = calories.value
            }
        });

        localStorage.setItem("listItem", JSON.stringify(listItem))
    }

    function deleteFrmLS(num){
        let listItem
        let arr
        let j = 1
        listItem = JSON.parse(localStorage.getItem("listItem"))
        arr = JSON.parse(localStorage.getItem("arr"))
        listItem.forEach((obj, index) => {
            if(obj["id"] === num){
                listItem.splice(index, 1)
            }
        })

        arr.forEach((number, index) => {
            if(number === num){
                arr.splice(index, 1)
            }
        })

        if(arr.length === 1){
            localStorage.clear()
        }
        else{
            const arrLength = arr.length
            arr = [0]
            for(i = 1; i < arrLength; i++){
                arr.push(i)
            }
            listItem.forEach(obj => {
                obj["id"] = j
                j++
            })
            localStorage.setItem("arr", JSON.stringify(arr))
            localStorage.setItem("listItem", JSON.stringify(listItem))
        }
        
    }

    function clearLs(){
        localStorage.clear()
    }

    function loadLS(){
        let num = 0
        listItem = JSON.parse(localStorage.getItem("listItem"))
        listItem.forEach(item => {
            num += 1
            document.querySelector(".collection").innerHTML += `<li id ="${num}" class="collection-item"><span class = "meal-value">${item["meal"]}</span> : <span class = "calorie-value">${item["calorie"]}</span><i class="edit-calorie material-icons secondary-content">edit</i></li>`
            totalCalories += Number(item["calorie"])
        })
        calorieNumber.textContent = totalCalories
    }

    return {
        ls : function(item){
            persistToLs(item)
        },

        uls : function(item){
            updateLS(item)
        },

        dls : function(item){
            deleteFrmLS(item)
        },

        cls : function(){
            clearLs()
        },

        lls : function(){
            loadLS()
        }
    }
})()

document.addEventListener("DOMContentLoaded", () => {
    storage.lls()
})

document.querySelector(".meal").addEventListener("click", function(e){
    if(e.target.classList.contains("add-task")){
        if(meal.value.replace(/ /g, "") === "" || calories.value.replace(/ /g, "") === ""){
            alert("Please Input All Fields")        
        }
        else{
            storage.ls({meal : meal.value, calorie: calories.value, id: 1})
            ui.add()
        }
    }
    else if(e.target.classList.contains("delete")){
        storage.dls(idNum)
        ui.delete()
    }
    else if(e.target.classList.contains("update")){
        storage.uls(idNum)
        ui.update(idNum)
    }
    else if(e.target.classList.contains("back")){
        ui.update(idNum)
    }
})
document.querySelector(".collection").addEventListener("click", function(e){
    if(e.target.classList.contains("edit-calorie")){
        if(meal.value.replace(/ /g, "") === "" || calories.value.replace(/ /g, "") === ""){
            idNum = Number(e.target.parentElement.id)
            ui.edit(e.target.parentElement)
        }
        else{
            alert("Please Finish With Your Current Edit")
        }
    }
})

document.querySelector(".clear").addEventListener("click", () => {
    storage.cls()
    ui.clear()
})