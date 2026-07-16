window.onload = function() {
    setTimeout(function(){
        let BuyBtns = document.querySelectorAll('[data-testid="add-button"');
        BuyBtns.forEach(function(thingy){
            thingy.addEventListener("click", event=>{
                console.log("KACHING!!!")
            })
        })
    }, 3000)
    if (location.href == "https://www.sainsburys.co.uk/gol-ui/checkout/summary") {
        console.log("Time to waste your money :D")
    }
}