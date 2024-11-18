document.addEventListener("alpine:init", () => {
  Alpine.data("products", () => ({
    items: [
      { id: 1, name: "Robusta", img: "1.jpg", price: 25000 },
      { id: 2, name: "Gayo", img: "2.jpg", price: 30000 },
      { id: 3, name: "Arabica", img: "3.jpg", price: 35000 },
      { id: 4, name: "Sumatra", img: "4.jpg", price: 40000 },
    ],
  }));

  Alpine.store("cart", {
    items: [],
    totalHarga: 0,
    totalBarang: 0,
    add(newItem) {
      // cek barang yang sama di cary
      const cartItem = this.items.find((item) => item.id === newItem.id);
      // jika barang masih kosong
      if (!cartItem) {
        this.items.push({ ...newItem, totalBarang: 1, totalHarga: newItem.price });
        this.totalBarang++; //menghitung total barang keseluruhan item
        this.totalHarga += newItem.price;
      } else {
        // jika barang sudah ada,
        this.items = this.items.map((item) => {
          if (item.id !== newItem.id) {
            return item;
          } else {
            //  cek barang beda atau sama di cart
            item.totalBarang++; //menghitung total barang satuan item
            item.totalHarga = item.price * item.totalBarang;

            this.totalBarang++;
            this.totalHarga += item.price;
            return item;
          }
        });
      }
    },
    remove(id) {
      const cartItem = this.items.find((item) => item.id === id);

      //jika item lebih dari 1
      if (cartItem.totalBarang > 1) {
        this.items = this.items.map((item) => {
          // jika bukan barang yg diklik

          if (item.id !== id) {
            return item;
          } else {
            item.totalBarang--;
            item.totalHarga = item.price * item.totalBarang;
            this.totalBarang--;
            this.totalHarga -= item.price;
            return item;
          }
        });
      } else if (cartItem.totalBarang === 1) {
        this.items = this.items.filter((item) => item.id !== id);
        this.totalBarang--;
        this.totalHarga -= cartItem.price;
      }
    },
  });
});

// konversi ke rupiah

const rupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};
