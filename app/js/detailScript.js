let slideshowIndex = 0
const slide = document.getElementById("current-slide")
const slideCounter = document.getElementById("slide-counter")
const images = [
    "../images/slideshow/FishInfo.jpg",
    "../images/slideshow/MouthFish.avif",
    "../images/slideshow/MouthFish2.jpg"
]

//Accepts a 1 or -1 from button onClick to get next or previous image
function changeSlide(step) {
    slideshowIndex += step
    slideshowIndex = ((slideshowIndex % images.length) + images.length) % images.length
    slide.src = images[slideshowIndex]
    slideCounter.innerText = `${slideshowIndex + 1}/${images.length}`
}
changeSlide(0) //Set initial slide

//Set date
const todayDate = new Date()
const dateDisplay = document.getElementById("date-display")
dateDisplay.innerText = todayDate.toLocaleDateString()

//Events
const upcomingEvents = document.getElementById("upcoming-events")
const pastEvents = document.getElementById("past-events")
const events = [
    {name: "Learn To Swim!", date: new Date("2024-09-12"), url: "https://www.gomotionapp.com/team/neafa/page/home"},
    {name: "Fishing Flea Market", date: new Date("2025-03-01"), url: "https://www.thefisherman.com/event/sjbca-30th-annual-fishermens-flea-market/"},
    {name: "Anglerfish Art Exhibit", date: new Date("2024-06-20"), url: "https://ranchomiragelibrary.libcal.com/event/12396505?hs=a"}
]

events.forEach(event => {
    if (event.date >= todayDate) {
        if (upcomingEvents.innerHTML === "") {
            upcomingEvents.classList.add("events-flex-column")
            upcomingEvents.innerHTML = "<h3>Upcoming Events</h3>"
        }
        upcomingEvents.innerHTML += `
            <div class="event-card">
                <a href=${event.url} target="_blank">
                    <h3 class="event">${event.name} - ${event.date.toLocaleDateString()}</h3>
                </a>
            </div>
        `
    }
    else {
        if (pastEvents.innerHTML === "") {
            pastEvents.classList.add("events-flex-column")
            pastEvents.innerHTML = "<h3>Past Events</h3>"
        }
        pastEvents.innerHTML += `
            <div class="event-card">
                <a href=${event.url} target="_blank">
                    <h3 class="event">${event.name} - ${event.date.toLocaleDateString()}</h3>
                </a>
            </div>
        `
    }
})

