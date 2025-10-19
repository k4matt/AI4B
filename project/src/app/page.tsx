"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import ThemeSwitch from "@/components/ThemeSwitch";
import AppleLogo from "@/assets/apple.svg";
import { IoFilter } from "react-icons/io5";
import { TbBuildingSkyscraper } from "react-icons/tb";

interface Address {
	address: string;
	city: string;
	state: string;
	postalCode: string;
}

interface Company {
	name: string;
	department: string;
	title: string;
	address: Address;
}

interface User {
	id: number;
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	address: Address;
	company: Company;
}

export default function HomePage() {
	const [users, setUsers] = useState<User[]>([]);
	const [search, setSearch] = useState("");
	const [selectedUser, setSelectedUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 30;

	useEffect(() => {
		fetch("https://dummyjson.com/users?limit=100")
			.then((res) => res.json())
			.then((data) => {
				setUsers(data.users);
			})
			.finally(() => setLoading(false));
	}, []);

	const filtered = users.filter((user) =>
		`${user.firstName} ${user.lastName}`.toLowerCase().includes(search.toLowerCase())
	);

	const totalPages = Math.ceil(filtered.length / itemsPerPage);
	const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

	const openUser = (user: User) => setSelectedUser(user);
	const closeUser = () => setSelectedUser(null);

	const goToPage = (page: number) => setCurrentPage(page);
	
	return (
		<main className={styles.container}>
			<div className={styles.dash}>
				<div className={styles.header}>
					<AppleLogo className={styles.logo} />
					<h1 className={styles.title}>Użytkownicy</h1>
					<ThemeSwitch />
				</div>

				<div className={styles.info}>
					<p>Lista użytkowników korzystających z naszych urządzeń</p>
				</div>

				<div className={styles.filters}>
					<span className={styles.found}>
						Znaleziono: {loading ? "..." : filtered.length}
					</span>
					<div className={styles.group}>
						<input
							type="text"
							placeholder=" "
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							className={styles.search}
						/>
						<label className={styles.searchLabel}>
							<svg
								width="20px"
								height="20px"
								viewBox="0 0 20 20"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path d="M17.545 15.467l-3.779-3.779a6.15 6.15 0 0 0 .898-3.21c0-3.417-2.961-6.377-6.378-6.377A6.185 6.185 0 0 0 2.1 8.287c0 3.416 2.961 6.377 6.377 6.377a6.15 6.15 0 0 0 3.115-.844l3.799 3.801a.953.953 0 0 0 1.346 0l.943-.943c.371-.371.236-.84-.135-1.211zM4.004 8.287a4.282 4.282 0 0 1 4.282-4.283c2.366 0 4.474 2.107 4.474 4.474a4.284 4.284 0 0 1-4.283 4.283c-2.366-.001-4.473-2.109-4.473-4.474z" />
							</svg>
							<span>Wyszukaj</span>
						</label>
					</div>
					<button>
						<IoFilter />
					</button>
				</div>

				<div
					className={`${styles.viewWrapper} ${
						selectedUser ? styles.showDetails : ""
					}`}
				>
					<ul className={styles.list}>
						{loading
							? Array.from({ length: 8 }).map((_, i) => (
									<li key={i} className={`${styles.card} ${styles.skeletonCard}`}>
										<div className={styles.skeletonHeader}>
											<div className={styles.skeletonTitle}></div>
										</div>
										<div className={styles.skeletonLines}>
											<div></div>
										</div>
									</li>
							))
							: filtered.map((user) => (
									<li
										key={user.id}
										className={styles.card}
										onClick={() => openUser(user)}
									>
										<div className={styles.cardHeader}>
											<h3>
												{user.firstName} {user.lastName}
											</h3>
											<p>
												<TbBuildingSkyscraper />
												{user.company.name}
											</p>
										</div>
									</li>
							))}
					</ul>

					<div className={styles.userDetails}>
						{selectedUser ? (
							<>
								<button className={styles.backBtn} onClick={closeUser}>
									← Powrót
								</button>
								<h2>
									{selectedUser.firstName} {selectedUser.lastName}
								</h2>
								<p>
									<strong>Telefon:</strong> {selectedUser.phone}
								</p>
								<p>
									<strong>Email:</strong> {selectedUser.email}
								</p>
								<p>
									<strong>Firma:</strong> {selectedUser.company.name}
								</p>
								<p>
									<strong>Stanowisko:</strong> {selectedUser.company.title}
								</p>
								<p>
									<strong>Dział:</strong> {selectedUser.company.department}
								</p>
								<p>
									<strong>Adres firmy:</strong>{" "}
									{selectedUser.company.address.address},{" "}
									{selectedUser.company.address.city},{" "}
									{selectedUser.company.address.state}{" "}
									{selectedUser.company.address.postalCode}
								</p>
								<p>
									<strong>Adres domowy:</strong> {selectedUser.address.address},{" "}
									{selectedUser.address.city}, {selectedUser.address.state}{" "}
									{selectedUser.address.postalCode}
								</p>
							</>
						) : (
							<p style={{ color: "var(--text-muted)" }}>
								Wybierz użytkownika z listy
							</p>
						)}
					</div>
				</div>
			</div>
		</main>
	);
}
