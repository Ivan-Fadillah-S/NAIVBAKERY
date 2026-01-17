package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"

	_ "github.com/go-sql-driver/mysql"
)

var db *sql.DB

func main() {
	var err error
	// Koneksi ke database MySQL
	db, err = sql.Open("mysql", "root:@tcp(localhost:3306)/naiv")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	// Test koneksi
	err = db.Ping()
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("Berhasil koneksi ke database")

	// Folder static
	// Folder static
	fs := http.FileServer(http.Dir("./static"))
	http.Handle("/static/", http.StripPrefix("/static/", fs))

	// Halaman utama
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "index.html")
	})

	// Simpan data form ke database
	http.HandleFunc("/contact", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != "POST" {
			http.NotFound(w, r)
			return
		}

		nama := r.FormValue("nama")
		email := r.FormValue("email")
		nohp := r.FormValue("nohp")
		pesan := r.FormValue("pesan")

		// Insert ke database
		_, err := db.Exec("INSERT INTO kontak (nama, email, nohp, pesan) VALUES (?, ?, ?, ?)", nama, email, nohp, pesan)
		if err != nil {
			http.Error(w, "Gagal menyimpan data", http.StatusInternalServerError)
			log.Println(err)
			return
		}

		fmt.Fprintf(w, "<h2>Terima kasih %s, pesanmu sudah kami simpan!</h2>", nama)
	})

	fmt.Println("Server berjalan di http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
