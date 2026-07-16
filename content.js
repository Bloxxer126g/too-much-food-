function waitForElement(selector, timeout = 5000) {
    return new Promise((resolve, reject) => {
        const existingElement = document.querySelector(selector);
        if (existingElement) {
            return resolve(existingElement);
        }
        const timer = setTimeout(() => {
            observer.disconnect();
            reject(new Error(`Timeout: Element "${selector}" not found within ${timeout}ms`));
        }, timeout);
        const observer = new MutationObserver(() => {
            const element = document.querySelector(selector);
            if (element) {
                clearTimeout(timer);
                observer.disconnect();
                resolve(element);
            }
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

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
        waitForElement('.trolley-item__item', 7000)
            .then(element => {
                setTimeout(function(){
                    document.querySelectorAll(".trolley-item__item").forEach(function(item){
                    const unmodifyiable = item.querySelector(".trolley-item__unmodifiable_info");
                    const wrapper = unmodifyiable.querySelector(".trolley-item__tile-checkout");
                    const wrapper2 = unmodifyiable.querySelector('[data-testid="dietary-warning-wrapper"]')
                    const cucumber = wrapper2.querySelector(".trolley-item__wrapper")
                    const product = wrapper.querySelector(".trolley-item__product");
                    
                    // stuff i need
                    let name = product.querySelector(".trolley-item__product-title").innerHTML;
                    let quantity = wrapper2.querySelector("p").innerHTML;
                    quantity = quantity.split(" ")[1]

                    console.log(name)
                    console.log(quantity)
                })
                }, 200)
            })
            .catch(err => console.error(err.message));
    }
}