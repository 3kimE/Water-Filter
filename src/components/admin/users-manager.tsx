"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, Trash2, ShieldCheck, PhoneCall, Wrench, Pencil, X } from "lucide-react";
import {
  createStaffUserAction,
  deleteStaffUserAction,
  updateStaffUserAction,
} from "@/lib/users-actions";
import type { StaffUser } from "@/lib/data";
import { useI18n } from "@/i18n/i18n-context";

const ROLE_META: Record<string, { labelKey: string; className: string; icon: typeof ShieldCheck }> = {
  admin: { labelKey: "admin.usersManager.role.admin", className: "bg-brand-100 text-brand-700", icon: ShieldCheck },
  confirmateur: { labelKey: "admin.usersManager.role.confirmateur", className: "bg-amber-100 text-amber-700", icon: PhoneCall },
  plombier: { labelKey: "admin.usersManager.role.technicien", className: "bg-emerald-100 text-emerald-700", icon: Wrench },
};

export function UsersManager({ users, currentUserId }: { users: StaffUser[]; currentUserId: string }) {
  const router = useRouter();
  const { t } = useI18n();
  const [pending, startTransition] = useTransition();
  const [form, setForm] = useState({ email: "", name: "", password: "", role: "confirmateur", city: "" });
  const [error, setError] = useState<string | null>(null);
  const [okMsg, setOkMsg] = useState<string | null>(null);

  function add(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setOkMsg(null);
    startTransition(async () => {
      const res = await createStaffUserAction(form);
      if (res.ok) {
        setOkMsg(t("admin.usersManager.accountCreated"));
        setForm({ email: "", name: "", password: "", role: "confirmateur", city: "" });
        router.refresh();
      } else {
        setError(res.error ?? t("admin.usersManager.error"));
      }
    });
  }

  function remove(id: string, label: string) {
    if (!confirm(t("admin.usersManager.deleteConfirm", { label }))) return;
    startTransition(async () => {
      const res = await deleteStaffUserAction(id);
      if (!res.ok) setError(res.error ?? t("admin.usersManager.error"));
      else router.refresh();
    });
  }

  // --- edit ---
  const [editing, setEditing] = useState<StaffUser | null>(null);
  const [eForm, setEForm] = useState({ email: "", name: "", role: "confirmateur", password: "", city: "" });
  const [eError, setEError] = useState<string | null>(null);

  function openEdit(u: StaffUser) {
    setEditing(u);
    setEForm({ email: u.email, name: u.name ?? "", role: u.role, password: "", city: u.city ?? "" });
    setEError(null);
  }

  function saveEdit() {
    if (!editing) return;
    setEError(null);
    startTransition(async () => {
      const res = await updateStaffUserAction(editing.id, eForm);
      if (res.ok) {
        setEditing(null);
        router.refresh();
      } else {
        setEError(res.error ?? t("admin.usersManager.error"));
      }
    });
  }

  const input =
    "h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-brand-300 focus:ring-4 focus:ring-brand-100";

  return (
    <div className="grid gap-6 lg:grid-cols-[22rem_1fr]">
      {/* Add form */}
      <form
        onSubmit={add}
        className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
      >
        <h2 className="flex items-center gap-2 font-display font-bold text-ink">
          <UserPlus className="h-5 w-5 text-brand-500" /> {t("admin.usersManager.newMember")}
        </h2>

        {error && (
          <div className="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-600">{error}</div>
        )}
        {okMsg && (
          <div className="mt-3 rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{okMsg}</div>
        )}

        <label className="mt-4 block text-sm font-medium text-ink">{t("admin.usersManager.roleLabel")}</label>
        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          className={`${input} mt-1`}
        >
          <option value="confirmateur">{t("admin.usersManager.roleOption.confirmateur")}</option>
          <option value="plombier">{t("admin.usersManager.roleOption.technicien")}</option>
          <option value="admin">{t("admin.usersManager.roleOption.admin")}</option>
        </select>

        <label className="mt-3 block text-sm font-medium text-ink">{t("admin.usersManager.nameLabel")}</label>
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className={`${input} mt-1`}
          placeholder={t("admin.usersManager.namePlaceholder")}
        />

        {form.role === "plombier" && (
          <>
            <label className="mt-3 block text-sm font-medium text-ink">{t("admin.usersManager.cityLabel")}</label>
            <input
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className={`${input} mt-1`}
              placeholder={t("admin.usersManager.cityPlaceholder")}
            />
            <p className="mt-1 text-xs text-ink-soft">
              {t("admin.usersManager.cityHelp")}
            </p>
          </>
        )}

        <label className="mt-3 block text-sm font-medium text-ink">{t("admin.usersManager.emailLabel")}</label>
        <input
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className={`${input} mt-1`}
          placeholder="nom@exemple.com"
        />

        <label className="mt-3 block text-sm font-medium text-ink">{t("admin.usersManager.passwordLabel")}</label>
        <input
          type="text"
          required
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className={`${input} mt-1`}
          placeholder={t("admin.usersManager.passwordPlaceholder")}
        />
        <p className="mt-1 text-xs text-ink-soft">
          {t("admin.usersManager.passwordHelp")}
        </p>

        <button
          type="submit"
          disabled={pending}
          className="mt-4 w-full rounded-full bg-brand-600 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
        >
          {pending ? t("admin.usersManager.creating") : t("admin.usersManager.createAccount")}
        </button>
      </form>

      {/* List */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <h2 className="border-b border-slate-200 px-5 py-4 font-display font-bold text-ink">
          {t("admin.usersManager.team", { count: users.length })}
        </h2>
        <div className="divide-y divide-slate-100">
          {users.map((u) => {
            const meta = ROLE_META[u.role] ?? ROLE_META.admin;
            return (
              <div
                key={u.id}
                onClick={() => openEdit(u)}
                className="flex cursor-pointer items-center gap-3 px-5 py-3 transition-colors hover:bg-slate-50"
              >
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${meta.className}`}>
                  <meta.icon className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-ink">
                    {u.name || u.email}
                    {u.id === currentUserId && (
                      <span className="ms-2 text-xs font-normal text-ink-soft">{t("admin.usersManager.you")}</span>
                    )}
                  </p>
                  <p className="truncate text-xs text-ink-soft">
                    {u.email}
                    {u.city ? ` · ${u.city}` : ""}
                  </p>
                </div>
                <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${meta.className}`}>
                  {t(meta.labelKey)}
                </span>
                <button
                  onClick={(e) => { e.stopPropagation(); openEdit(u); }}
                  disabled={pending}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-ink-soft transition hover:bg-brand-50 hover:text-brand-600 disabled:opacity-50"
                  aria-label={t("admin.usersManager.edit")}
                >
                  <Pencil className="h-4 w-4" />
                </button>
                {u.id !== currentUserId && (
                  <button
                    onClick={(e) => { e.stopPropagation(); remove(u.id, u.name || u.email); }}
                    disabled={pending}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-ink-soft transition hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50"
                    aria-label={t("admin.usersManager.delete")}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Edit modal */}
      {editing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
          onClick={() => setEditing(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-display font-bold text-ink">{t("admin.usersManager.editMember")}</h3>
              <button onClick={() => setEditing(null)} className="text-ink-soft hover:text-ink">
                <X className="h-5 w-5" />
              </button>
            </div>
            {eError && (
              <div className="mb-3 rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-600">{eError}</div>
            )}

            <label className="block text-sm font-medium text-ink">{t("admin.usersManager.roleLabel")}</label>
            <select
              value={eForm.role}
              onChange={(e) => setEForm({ ...eForm, role: e.target.value })}
              disabled={editing.id === currentUserId}
              className={`${input} mt-1 disabled:opacity-60`}
            >
              <option value="confirmateur">{t("admin.usersManager.role.confirmateur")}</option>
              <option value="plombier">{t("admin.usersManager.role.technicien")}</option>
              <option value="admin">{t("admin.usersManager.role.admin")}</option>
            </select>
            {editing.id === currentUserId && (
              <p className="mt-1 text-xs text-ink-soft">
                {t("admin.usersManager.cannotChangeOwnRole")}
              </p>
            )}

            <label className="mt-3 block text-sm font-medium text-ink">{t("admin.usersManager.nameLabel")}</label>
            <input
              value={eForm.name}
              onChange={(e) => setEForm({ ...eForm, name: e.target.value })}
              className={`${input} mt-1`}
            />

            {eForm.role === "plombier" && (
              <>
                <label className="mt-3 block text-sm font-medium text-ink">{t("admin.usersManager.cityLabel")}</label>
                <input
                  value={eForm.city}
                  onChange={(e) => setEForm({ ...eForm, city: e.target.value })}
                  className={`${input} mt-1`}
                  placeholder={t("admin.usersManager.cityPlaceholder")}
                />
              </>
            )}

            <label className="mt-3 block text-sm font-medium text-ink">{t("admin.usersManager.emailLabel")}</label>
            <input
              type="email"
              value={eForm.email}
              onChange={(e) => setEForm({ ...eForm, email: e.target.value })}
              className={`${input} mt-1`}
            />

            <label className="mt-3 block text-sm font-medium text-ink">{t("admin.usersManager.newPasswordLabel")}</label>
            <input
              type="text"
              value={eForm.password}
              onChange={(e) => setEForm({ ...eForm, password: e.target.value })}
              placeholder={t("admin.usersManager.newPasswordPlaceholder")}
              className={`${input} mt-1`}
            />

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setEditing(null)}
                className="flex-1 rounded-full border border-slate-200 py-2.5 text-sm font-semibold text-ink-soft transition hover:bg-slate-50"
              >
                {t("admin.usersManager.cancel")}
              </button>
              <button
                onClick={saveEdit}
                disabled={pending}
                className="flex-1 rounded-full bg-brand-600 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
              >
                {pending ? t("admin.usersManager.saving") : t("admin.usersManager.save")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
