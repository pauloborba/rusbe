export class MenuApi{
    /*
        0: Protein,
        1: Carbs,
        2: Desert,
        3: Drinking
    */
    breakfastOptions : String[][] = [
        ["Ovos mexidos", "Carne de Charque", "Salsicha", "Carne de Sol"],
        ["Hiame","Macaxeira","Munguza","Batata doce","Torrada","Sopa de carne","Sopa de cebola"],
        ["Frutas", "Goiabada"],
        ["Café", "Leite", "Refresco"]
    ];
    
    lunchOptions : String[][] = [
        ["Peixe empanado", "Bife", "Peito de frango", "Coxa de frango"],
        ["Macarrao","Arroz","Feijao","Pure","Batata","Salada"],
        ["Doce de banana", "Frutas", "Goiabada"],
        ["Suco de acerola", "Suco de laranja", "Suco de goiaba", "Refresco"]
    ];

    dinnerOptions : String[][] = [
        ["Ovos mexidos", "Carne de Charque", "Salsicha", "Carne de Sol"],
        ["Hiame","Macaxeira","Munguza","Batata doce","Torrada","Sopa de carne","Sopa de cebola"],
        ["Frutas", "Goiabada"],
        ["Café", "Leite", "Refresco"]
    ];

    getDay() : number{
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        return parseInt(dd);
    }

    getMonth() : number{
        var today = new Date();
        var mm = String(today.getMonth() + 1).padStart(2, '0');
        return parseInt(mm);
    }

    getMenu(option) : Object{
        var menu = {
            protein : [],
            carbs : [],
            desert : [],
            drink : []
        };

        var hash = this.getDay()*7 + this.getMonth()*23;

        if (option=="breakfast"){
            var sz = 1;
            sz = this.breakfastOptions[0].length;
            menu.protein.push(this.breakfastOptions[0][hash%sz]);
            sz = this.breakfastOptions[1].length;
            menu.carbs.push(this.breakfastOptions[1][hash%sz]);
            sz = this.breakfastOptions[2].length;
            menu.desert.push(this.breakfastOptions[2][hash%sz]);
            sz = this.breakfastOptions[3].length;
            menu.drink.push(this.breakfastOptions[3][hash%sz]);
        }else if (option=="lunch"){
            var sz = 1;
            sz = this.lunchOptions[0].length;
            menu.protein.push(this.lunchOptions[0][hash%sz]);
            sz = this.lunchOptions[1].length;
            menu.carbs.push(this.lunchOptions[1][hash%sz]);
            sz = this.lunchOptions[2].length;
            menu.desert.push(this.lunchOptions[2][hash%sz]);
            sz = this.lunchOptions[3].length;
            menu.drink.push(this.lunchOptions[3][hash%sz]);
        }else if (option=="dinner"){
            var sz = 1;
            sz = this.dinnerOptions[0].length;
            menu.protein.push(this.dinnerOptions[0][hash%sz]);
            sz = this.dinnerOptions[1].length;
            menu.carbs.push(this.dinnerOptions[1][hash%sz]);
            sz = this.dinnerOptions[2].length;
            menu.desert.push(this.dinnerOptions[2][hash%sz]);
            sz = this.dinnerOptions[3].length;
            menu.drink.push(this.dinnerOptions[3][hash%sz]);
        }

        return menu;
    }

    getDailyMenu() : Object{
        const menu = {
            breakfast: this.getMenu("breakfast"),
            lunch: this.getMenu("lunch"),
            dinner: this.getMenu("dinner")
        }

        return menu;
    }
}