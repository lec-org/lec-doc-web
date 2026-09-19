import { Group, Table, Text, Badge } from "@mantine/core";
import { useWorkspaceMembersQuery } from "@/features/workspace/queries/workspace-query.ts";
import { CustomAvatar } from "@/components/ui/custom-avatar.tsx";
import React from "react";
import { getUserRoleLabel } from "@/features/workspace/types/user-role-data.ts";
import { useTranslation } from "react-i18next";
import Paginate from "@/components/common/paginate.tsx";
import { SearchInput } from "@/components/common/search-input.tsx";
import NoTableResults from "@/components/common/no-table-results.tsx";
import { usePaginateAndSearch } from "@/hooks/use-paginate-and-search.tsx";

export default function WorkspaceMembersTable() {
  const { t } = useTranslation();
  const { search, cursor, goNext, goPrev, handleSearch } = usePaginateAndSearch();
  const { data } = useWorkspaceMembersQuery({
    cursor,
    limit: 100,
    query: search,
  });
  return (
    <>
      <SearchInput onSearch={handleSearch} />
      <Table.ScrollContainer minWidth={600}>
        <Table highlightOnHover verticalSpacing="sm">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>{t("User")}</Table.Th>
              <Table.Th>{t("Status")}</Table.Th>
              <Table.Th>{t("Role")}</Table.Th>
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {data?.items.length > 0 ? (
              data?.items.map((user, index) => (
                <Table.Tr key={index}>
                  <Table.Td>
                    <Group gap="sm" wrap="nowrap">
                      <CustomAvatar
                        avatarUrl={user.avatarUrl}
                        name={user.name}
                      />
                      <div>
                        <Text fz="sm" fw={500} lineClamp={1}>
                          {user.name}
                        </Text>
                        <Text fz="xs" c="dimmed">
                          {user.email}
                        </Text>
                      </div>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    {user.deactivatedAt ? (
                      <Badge variant="light" color="orange">
                        {t("Deactivated")}
                      </Badge>
                    ) : (
                      <Badge variant="light">{t("Active")}</Badge>
                    )}
                  </Table.Td>
                  <Table.Td>
                    <Badge variant="light" color="gray">
                      {t(getUserRoleLabel(user.role))}
                    </Badge>
                  </Table.Td>
                </Table.Tr>
              ))
            ) : (
              <NoTableResults colSpan={3} />
            )}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>

      {data?.items.length > 0 && (
        <Paginate
          hasPrevPage={data?.meta?.hasPrevPage}
          hasNextPage={data?.meta?.hasNextPage}
          onNext={() => goNext(data?.meta?.nextCursor)}
          onPrev={goPrev}
        />
      )}
    </>
  );
}
